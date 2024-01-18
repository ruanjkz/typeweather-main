import './styles.css';

import { useEffect, useState } from 'react';
import { GetWeatherByCityResponseProps, getWeatherByCity } from '../../services/getWeatherByCity';

import { Today } from '../../components/Today';
import { Details } from '../../components/Details';
import { Loading } from '../../components/Loading';
import { NextDays } from '../../components/NextDays';
import { CityProps } from '../../services/getCityByNameService';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const [data, setData] = useState<GetWeatherByCityResponseProps>({} as GetWeatherByCityResponseProps);
  const [isLoading, setIsLoading] = useState(true);
  const storedCity = localStorage.getItem('@typewheather:city');
  const [city, setCity] = useState<CityProps>(storedCity ? JSON.parse(storedCity) : null);
  const navigate = useNavigate()

  useEffect(() => {
    if (city) {
      setIsLoading(true);

      const { latitude, longitude } = city;

      getWeatherByCity({ latitude, longitude })
        .then((response) => setData(response))
        .finally(() => setIsLoading(false));
    } else {
      setTimeout(() => {
        setIsLoading(false);
        navigate('/')
      }, 1000)
    }
  }, [city]);

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className='dashboard'>
      <Today city={city.name} onSearchValue={setCity} weather={data.today.weather} />
      <Details data={data.today.details} />
      <NextDays data={data.nextDays} />
    </div>
  )
}