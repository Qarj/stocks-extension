/* jshint esnext:true */
/*
 *  GNOME Shell Extension to display stock quotes
 *
 * Copyright (C) 2019
 *     Florijan Hamzic <florijanh@gmail.com> @ infinicode.de
 *
 * This file is part of gnome-shell-extension-stocks.
 *
 * gnome-shell-extension-stocks is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * gnome-shell-extension-stocks is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with gnome-shell-extension-stocks.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

const Gettext = imports.gettext
const _ = Gettext.gettext

const Soup = imports.gi.Soup

const _httpSession = new Soup.Session()
_httpSession.user_agent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
_httpSession.timeout = 10

var Quote = class Quote {
  constructor (symbol, quoteData) {

    this.Name = null
    this.FullName = null
    this.Symbol = symbol
    this.Timestamp = null
    this.PreviousClose = null
    this.Close = null
    this.Open = null
    this.Low = null
    this.High = null
    this.Volume = null
    this.CurrencySymbol = null
    this.ExchangeName = null

    if (quoteData) {
      this.FullName = quoteData.price.longName
      this.Timestamp = quoteData.price.regularMarketTime
      this.PreviousClose = quoteData.price.regularMarketPreviousClose
      this.Close = quoteData.price.regularMarketPrice
      this.Open = quoteData.price.regularMarketOpen
      this.Low = quoteData.price.regularMarketDayLow
      this.High = quoteData.price.regularMarketDayHigh
      this.Volume = quoteData.price.regularMarketVolume
      this.CurrencySymbol = quoteData.price.currencySymbol
      this.ExchangeName = quoteData.price.exchangeName
    }
  }
}

var YahooFinanceService = class YahooFinanceService {
  /**
   * Loads the previous close value from jaywho finance
   * @param symbol yahoo exchange/symbol pair (e.g. AHLA.DE, KU2.DE, 7974.T)
   * @param onComplete what to do when request has been completed
   */
  loadQuoteAsync (symbol, onComplete) {
    const message = Soup.Message.new('GET', `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?formatted=false&lang=en-US&region=US&modules=price%2CsummaryDetail%2CpageViews&corsDomain=finance.yahoo.com`)

    _httpSession.queue_message(message, (_httpSession, message) => {
      if (!message.response_body.data) {
        onComplete.call(this, new Quote(symbol))
        return
      }

      try {
        const result = JSON.parse(message.response_body.data)

        onComplete.call(this, new Quote(symbol, result.quoteSummary.result[0]))
      } catch (e) {
        log(e)
        onComplete.call(this, new Quote(symbol))
      }
    })
  }
}
