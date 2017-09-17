# zabbixCryptoChart

## Test Environment
* CentOS 7.3.1611
* Zabbix 3.2.4

## Require
* nodejs
* zabbix
* jq

## Installation

### file download
```
git clone https://github.com/planethouki/zabbixCryptoChart.git
cd zabbixCryptoChart
chmod a+x get-data-hourly.sh get-data.sh make-discovery.sh make-list.sh zabbixCryptoDiscovery.sh zabbixGetPrice.sh
./get-data.sh
./get-data-hourly.sh
./make-list.sh
./make-discovery.sh
```

### zabbix agent setting
```
vi /etc/zabbix/zabbix_agentd.conf
UserParameter=all_market,/opt/zabbixCryptoChart/zabbixCryptoDiscovery.sh
UserParameter=crypto_price[*],/opt/zabbixCryptoChart/zabbixGetPrice.sh $1 $2
systemctl restart zabbix-agent
```

### cron
```
crontab -e
*/5 * * * * {yourdirectory}/get-data.sh
0 * * * * {yourdirectory}/get-data-hourly.sh
5 * * * * {yourdirectory}/make-list.sh
10 * * * * {yourdirectory}/gmake-discovery.sh
```

### zabbix server web setting
#### Low Level Discovery rule
Configuration > Templates > YourTemplateName > Discovery > Create discovery rule

| Item | Value |
----|----
| Name | as you like |
| Type | Zabbix agent (active) |
| Key | all_market |

#### Item prototype
YourDiscoveryName > Item prototypes > Create Item prototype

| Item | Value
----|----
| Name | See below
| Type | Zabbix agent (active)
| Key | See below
| Type of Information | Numeric (float) |
| Use custom multipiler | if satoshi, 100000000 |
| Update interval (in sec) | 300 or more |

Available set

| Name | Key
----|----
| Zaif {#JPY_ZAIF} | crypto_price[zaif,{#JPY_ZAIF}] |
| Zaif {#BTC_ZAIF} | crypto_price[zaif,{#BTC_ZAIF}] |
| Poloniex {#USDT_POLONIEX} | crypto_price[poloniex,{#USDT_POLONIEX}] |
| Poloniex {#BTC_POLONIEX} | crypto_price[poloniex,{#BTC_POLONIEX}] |
| fisco {#JPY_FISCO} | crypto_price[fisco,{#JPY_FISCO}] |
| fisco {#BTC_FISCO} | crypto_price[fisco,{#BTC_FISCO}] |
| Cryptopia {#USDT_CRYPTOPIA} | crypto_price[cryptopia,{#USDT_CRYPTOPIA}] |
| Cryptopia {#BTC_CRYPTOPIA} | crypto_price[cryptopia,{#BTC_CRYPTOPIA}] |
| Coincheck {#JPY_COINCHECK} | crypto_price[coincheck,{#JPY_COINCHECK}] |
| Coincheck {#BTC_COINCHECK} | crypto_price[coincheck,{#BTC_COINCHECK}] |
| Bittrex {#USDT_BITTREX} | crypto_price[bittrex,{#USDT_BITTREX}] |
| Bittrex {#BTC_BITTREX} | crypto_price[bittrex,{#BTC_BITTREX}] |
| Bitflyer {#JPY_BITFLYER} | crypto_price[bitflyer,{#JPY_BITFLYER}] |
| Bitflyer {#BTC_BITFLYER} | crypto_price[bitflyer,{#BTC_BITFLYER}] |
| Bitbank {#JPY_BITBANK} | crypto_price[bitbank,{#JPY_BITBANK}] |
| Bitbank {#BTC_BITBANK} | crypto_price[bitbank,{#BTC_BITBANK}] |

#### Trigger prototype & Graph prototype
as you like
