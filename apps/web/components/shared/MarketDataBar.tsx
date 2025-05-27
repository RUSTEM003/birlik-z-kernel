import React, { useEffect, useState } from 'react';

interface WeatherData {
  name: string;
  main: {
    temp: number;
  };
  weather: Array<{
    description: string;
  }>;
}

interface PriceData {
  bitcoin: number;
  ethereum: number;
  tether: number;
  usdKzt: number;
  usdRub: number;
  usdEur: number;
  usdGbp: number;
  gold: number;
}

interface BankStatus {
  health: string;
}

interface LogisticsStatus {
  active_routes: number;
}

const MarketDataBar: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData>({} as WeatherData);
  const [prices, setPrices] = useState<PriceData>({
    bitcoin: 0,
    ethereum: 0,
    tether: 0,
    usdKzt: 0,
    usdRub: 0,
    usdEur: 0,
    usdGbp: 0,
    gold: 0,
  });
  const [bankStatus, setBankStatus] = useState<BankStatus>({ health: 'Stable' });
  const [logisticsStatus, setLogisticsStatus] = useState<LogisticsStatus>({ active_routes: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadMarketData = async () => {
      const weatherRes = {
        data: {
          name: 'Astana',
          main: { temp: 22.5 },
          weather: [{ description: 'clear sky' }]
        }
      };
      
      const cryptoRes = {
        data: {
          bitcoin: { usd: 45678.32 },
          ethereum: { usd: 3245.67 },
          tether: { usd: 1.00 }
        }
      };
      
      const forexRes = {
        data: {
          rates: {
            KZT: 450.25,
            RUB: 75.34,
            EUR: 0.92,
            GBP: 0.78
          }
        }
      };
      
      const metalRes = {
        data: {
          price: 1876.50
        }
      };
      
      const bankRes = {
        data: {
          health: 'Excellent'
        }
      };
      
      const logisticsRes = {
        data: {
          active_routes: 1243
        }
      };

      setWeather(weatherRes.data);
      setPrices({
        bitcoin: cryptoRes.data.bitcoin.usd,
        ethereum: cryptoRes.data.ethereum.usd,
        tether: cryptoRes.data.tether.usd,
        usdKzt: forexRes.data.rates.KZT,
        usdRub: forexRes.data.rates.RUB,
        usdEur: forexRes.data.rates.EUR,
        usdGbp: forexRes.data.rates.GBP,
        gold: metalRes.data.price,
      });
      setBankStatus(bankRes.data);
      setLogisticsStatus(logisticsRes.data);
    };

    loadMarketData();
    const interval = setInterval(loadMarketData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-gray-900 text-white py-2 px-4 text-sm flex flex-col md:flex-row md:justify-between md:items-center">
      <div className="mb-1 md:mb-0">
        <strong>
          {time.toLocaleDateString("ru-RU", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </strong>
        , {time.toLocaleTimeString("ru-RU")}
      </div>
      <div className="mb-1 md:mb-0">
        {weather.name && (
          <span>
            🌧️ {weather.name}: {Math.round(weather.main.temp)}°C, {weather.weather[0].description}
          </span>
        )}
      </div>
      <div className="overflow-hidden whitespace-nowrap animate-marquee">
        📈 BTC: ${prices.bitcoin} | ETH: ${prices.ethereum} | USDT: ${prices.tether} | GOLD: ${prices.gold}$ | USD/KZT: {prices.usdKzt} | USD/RUB: {prices.usdRub} | USD/EUR: {prices.usdEur} | USD/GBP: {prices.usdGbp} | 🏦 Банк: {bankStatus.health} | 🚚 Логистика: {logisticsStatus.active_routes} маршрутов
      </div>
    </div>
  );
};

export default MarketDataBar;
