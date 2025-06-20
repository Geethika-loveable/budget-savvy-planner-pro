
export const currencies = [
  // Major currencies
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Zloty' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
  { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  { code: 'ARS', symbol: '$', name: 'Argentine Peso' },
  { code: 'CLP', symbol: '$', name: 'Chilean Peso' },
  { code: 'COP', symbol: '$', name: 'Colombian Peso' },
  { code: 'PEN', symbol: 'S/', name: 'Peruvian Sol' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'EGP', symbol: '£', name: 'Egyptian Pound' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  { code: 'MAD', symbol: 'د.م.', name: 'Moroccan Dirham' },
  { code: 'TND', symbol: 'د.ت', name: 'Tunisian Dinar' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'QAR', symbol: '﷼', name: 'Qatari Riyal' },
  { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar' },
  { code: 'BHD', symbol: '.د.ب', name: 'Bahraini Dinar' },
  { code: 'OMR', symbol: '﷼', name: 'Omani Rial' },
  { code: 'JOD', symbol: 'د.ا', name: 'Jordanian Dinar' },
  { code: 'LBP', symbol: '£', name: 'Lebanese Pound' },
  { code: 'ILS', symbol: '₪', name: 'Israeli Shekel' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'TWD', symbol: 'NT$', name: 'Taiwan Dollar' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  // Additional world currencies
  { code: 'AFN', symbol: '؋', name: 'Afghan Afghani' },
  { code: 'ALL', symbol: 'L', name: 'Albanian Lek' },
  { code: 'DZD', symbol: 'د.ج', name: 'Algerian Dinar' },
  { code: 'AOA', symbol: 'Kz', name: 'Angolan Kwanza' },
  { code: 'XCD', symbol: '$', name: 'East Caribbean Dollar' },
  { code: 'AMD', symbol: '֏', name: 'Armenian Dram' },
  { code: 'AWG', symbol: 'ƒ', name: 'Aruban Florin' },
  { code: 'AZN', symbol: '₼', name: 'Azerbaijani Manat' },
  { code: 'BSD', symbol: '$', name: 'Bahamian Dollar' },
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
  { code: 'BBD', symbol: '$', name: 'Barbadian Dollar' },
  { code: 'BYN', symbol: 'Br', name: 'Belarusian Ruble' },
  { code: 'BZD', symbol: '$', name: 'Belize Dollar' },
  { code: 'XOF', symbol: 'Fr', name: 'West African CFA Franc' },
  { code: 'BTN', symbol: 'Nu.', name: 'Bhutanese Ngultrum' },
  { code: 'BOB', symbol: 'Bs.', name: 'Bolivian Boliviano' },
  { code: 'BAM', symbol: 'КМ', name: 'Bosnia-Herzegovina Convertible Mark' },
  { code: 'BWP', symbol: 'P', name: 'Botswanan Pula' },
  { code: 'BND', symbol: '$', name: 'Brunei Dollar' },
  { code: 'BGN', symbol: 'лв', name: 'Bulgarian Lev' },
  { code: 'BIF', symbol: 'Fr', name: 'Burundian Franc' },
  { code: 'CVE', symbol: '$', name: 'Cape Verdean Escudo' },
  { code: 'KHR', symbol: '៛', name: 'Cambodian Riel' },
  { code: 'XAF', symbol: 'Fr', name: 'Central African CFA Franc' },
  { code: 'CDF', symbol: 'Fr', name: 'Congolese Franc' },
  { code: 'CRC', symbol: '₡', name: 'Costa Rican Colón' },
  { code: 'HRK', symbol: 'kn', name: 'Croatian Kuna' },
  { code: 'CUP', symbol: '$', name: 'Cuban Peso' },
  { code: 'CYP', symbol: '£', name: 'Cypriot Pound' },
  { code: 'DJF', symbol: 'Fr', name: 'Djiboutian Franc' },
  { code: 'DOP', symbol: '$', name: 'Dominican Peso' },
  { code: 'ERN', symbol: 'Nfk', name: 'Eritrean Nakfa' },
  { code: 'EEK', symbol: 'kr', name: 'Estonian Kroon' },
  { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr' },
  { code: 'FKP', symbol: '£', name: 'Falkland Islands Pound' },
  { code: 'FJD', symbol: '$', name: 'Fijian Dollar' },
  { code: 'GMD', symbol: 'D', name: 'Gambian Dalasi' },
  { code: 'GEL', symbol: '₾', name: 'Georgian Lari' },
  { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi' },
  { code: 'GIP', symbol: '£', name: 'Gibraltar Pound' },
  { code: 'GTQ', symbol: 'Q', name: 'Guatemalan Quetzal' },
  { code: 'GGP', symbol: '£', name: 'Guernsey Pound' },
  { code: 'GNF', symbol: 'Fr', name: 'Guinean Franc' },
  { code: 'GYD', symbol: '$', name: 'Guyanese Dollar' },
  { code: 'HTG', symbol: 'G', name: 'Haitian Gourde' },
  { code: 'HNL', symbol: 'L', name: 'Honduran Lempira' },
  { code: 'ISK', symbol: 'kr', name: 'Icelandic Króna' },
  { code: 'IRR', symbol: '﷼', name: 'Iranian Rial' },
  { code: 'IQD', symbol: 'ع.د', name: 'Iraqi Dinar' },
  { code: 'IMP', symbol: '£', name: 'Isle of Man Pound' },
  { code: 'JMD', symbol: '$', name: 'Jamaican Dollar' },
  { code: 'JEP', symbol: '£', name: 'Jersey Pound' },
  { code: 'KZT', symbol: '₸', name: 'Kazakhstani Tenge' },
  { code: 'KPW', symbol: '₩', name: 'North Korean Won' },
  { code: 'KGS', symbol: 'с', name: 'Kyrgystani Som' },
  { code: 'LAK', symbol: '₭', name: 'Laotian Kip' },
  { code: 'LVL', symbol: 'Ls', name: 'Latvian Lats' },
  { code: 'LRD', symbol: '$', name: 'Liberian Dollar' },
  { code: 'LYD', symbol: 'ل.د', name: 'Libyan Dinar' },
  { code: 'LTL', symbol: 'Lt', name: 'Lithuanian Litas' },
  { code: 'MOP', symbol: 'P', name: 'Macanese Pataca' },
  { code: 'MKD', symbol: 'ден', name: 'Macedonian Denar' },
  { code: 'MGA', symbol: 'Ar', name: 'Malagasy Ariary' },
  { code: 'MWK', symbol: 'MK', name: 'Malawian Kwacha' },
  { code: 'MVR', symbol: '.ރ', name: 'Maldivian Rufiyaa' },
  { code: 'MRU', symbol: 'UM', name: 'Mauritanian Ouguiya' },
  { code: 'MUR', symbol: '₨', name: 'Mauritian Rupee' },
  { code: 'MDL', symbol: 'L', name: 'Moldovan Leu' },
  { code: 'MNT', symbol: '₮', name: 'Mongolian Tugrik' },
  { code: 'MZN', symbol: 'MT', name: 'Mozambican Metical' },
  { code: 'MMK', symbol: 'Ks', name: 'Myanmar Kyat' },
  { code: 'NAD', symbol: '$', name: 'Namibian Dollar' },
  { code: 'NPR', symbol: '₨', name: 'Nepalese Rupee' },
  { code: 'ANG', symbol: 'ƒ', name: 'Netherlands Antillean Guilder' },
  { code: 'NIO', symbol: 'C$', name: 'Nicaraguan Córdoba' },
  { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee' },
  { code: 'PAB', symbol: 'B/.', name: 'Panamanian Balboa' },
  { code: 'PGK', symbol: 'K', name: 'Papua New Guinean Kina' },
  { code: 'PYG', symbol: '₲', name: 'Paraguayan Guarani' },
  { code: 'RON', symbol: 'lei', name: 'Romanian Leu' },
  { code: 'RWF', symbol: 'Fr', name: 'Rwandan Franc' },
  { code: 'SHP', symbol: '£', name: 'Saint Helena Pound' },
  { code: 'WST', symbol: 'T', name: 'Samoan Tala' },
  { code: 'STN', symbol: 'Db', name: 'São Tomé and Príncipe Dobra' },
  { code: 'RSD', symbol: 'дин.', name: 'Serbian Dinar' },
  { code: 'SCR', symbol: '₨', name: 'Seychellois Rupee' },
  { code: 'SLE', symbol: 'Le', name: 'Sierra Leonean Leone' },
  { code: 'SBD', symbol: '$', name: 'Solomon Islands Dollar' },
  { code: 'SOS', symbol: 'Sh', name: 'Somali Shilling' },
  { code: 'LKR', symbol: '₨', name: 'Sri Lankan Rupee' },
  { code: 'SDG', symbol: '£', name: 'Sudanese Pound' },
  { code: 'SRD', symbol: '$', name: 'Surinamese Dollar' },
  { code: 'SZL', symbol: 'L', name: 'Swazi Lilangeni' },
  { code: 'SYP', symbol: '£', name: 'Syrian Pound' },
  { code: 'TJS', symbol: 'SM', name: 'Tajikistani Somoni' },
  { code: 'TZS', symbol: 'Sh', name: 'Tanzanian Shilling' },
  { code: 'TOP', symbol: 'T$', name: 'Tongan Paʻanga' },
  { code: 'TTD', symbol: '$', name: 'Trinidad and Tobago Dollar' },
  { code: 'TMT', symbol: 'm', name: 'Turkmenistani Manat' },
  { code: 'TVD', symbol: '$', name: 'Tuvaluan Dollar' },
  { code: 'UGX', symbol: 'Sh', name: 'Ugandan Shilling' },
  { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia' },
  { code: 'UYU', symbol: '$', name: 'Uruguayan Peso' },
  { code: 'UZS', symbol: 'so\'m', name: 'Uzbekistani Som' },
  { code: 'VUV', symbol: 'Vt', name: 'Vanuatu Vatu' },
  { code: 'VES', symbol: 'Bs.S', name: 'Venezuelan Bolívar' },
  { code: 'YER', symbol: '﷼', name: 'Yemeni Rial' },
  { code: 'ZMW', symbol: 'ZK', name: 'Zambian Kwacha' },
  { code: 'ZWL', symbol: '$', name: 'Zimbabwean Dollar' }
];

export const getCurrencySymbol = (code: string) => {
  const currency = currencies.find(c => c.code === code);
  return currency?.symbol || '$';
};
