/* jshint esnext:true */
/* -*- mode: js -*- */
/*
 Copyright (c) Florijan Hamzic <florijanh@gmail.com>

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright
 notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 notice, this list of conditions and the following disclaimer in the
 documentation and/or other materials provided with the distribution.
 * Neither the name of the GNOME nor the
 names of its contributors may be used to endorse or promote products
 derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

const Gettext = imports.gettext

const St = imports.gi.St

const Main = imports.ui.main
const MessageTray = imports.ui.messageTray

// extensionMeta is the object obtained from the metadata.json file, plus // the path property which is the path of the extension folder!
function init (extensionMeta) {
  let theme = imports.gi.Gtk.IconTheme.get_default()
  theme.append_search_path(extensionMeta.path + '/icons')
}

function createActionButton (iconName, accessibleName, classes, onClick) {
  classes = classes || ''

  const icon = new St.Icon({ icon_name: iconName, style_class: 'popup-menu-icon' })

  const iconButton = new St.Button({
    reactive: true,
    can_focus: true,
    track_hover: true,
    accessible_name: accessibleName,
    style_class: 'system-menu-action ' + classes,
    child: icon
  })

  if (onClick) {
    iconButton.connect('clicked', onClick)
  }

  return iconButton
}

function createButton (text, accessibleName, classes, onClick) {
  let button = new St.Button({
    reactive: true,
    can_focus: true,
    track_hover: true,
    label: text,
    accessible_name: accessibleName,
    style_class: 'popup-menu-item button ' + classes
  })

  if (onClick) {
    button.connect('clicked', onClick)
  }

  return button
}

function showNotification (title, message, icon) {
  let source = new MessageTray.Source('TaskWhisperer', icon || 'dialog-warning')
  let notification = new MessageTray.Notification(source, title, message)
  Main.messageTray.add(source)
  source.notify(notification)
}
