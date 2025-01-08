import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from '../private-route/private-route';
import LoginPage from '../../pages/login-page/login-page';
import OfferPage from '../../pages/offer-page/offer-page';
import MainPage from '../../pages/main-page/main-page';
import FavoritesPage from '../../pages/favorites-page/favorites-page';
import Error404 from '../../pages/Error404/Error404';
import useAppInit from '../../utils/use-init-app/use-init-app';
import { APP_ROUTES } from '../../services/constants';
import { useEffect } from 'react';

import { useState } from 'react';

function stringToIntHash(str: string): number {
  let hash = 0;
  const prime = 31; // A small prime number for better distribution

  for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i); // Get the ASCII/Unicode value of the character
      hash = (hash * prime + charCode) | 0; // Use bitwise OR to ensure a 32-bit integer
  }

  return hash;
}

function App(): JSX.Element {
  const [usePopup, setUsePopup] = useState(false);
  const [reviewsToUp, setReviewsToUp] = useState<boolean>(false);

  // unused variable
  console.log(reviewsToUp);

  useAppInit();
  useEffect(() => {
    // need to wait fo yandex metrika loading
    setTimeout(() => {
      // yandex metrika 
      var counter = (window as any).yaCounter99437467;
    
      if (counter && counter.getClientID) {
        const id: string = counter.getClientID();
        const hash = stringToIntHash(id);

        // ensure that it is even chance
        //      33% - no change 
        //      33% - popups 
        //      33% - Yuliya 
        const usePopupDialogs = hash % 3 === 1; 
          // hash % 3 === 1;
        const reviewsToUpFlag = hash % 3 === 0;
           // hash % 3 === 2;

        const group = usePopupDialogs ? 'popups' : (reviewsToUp ? 'reviewsToUp' : 'common');

        // hash is unused variable
        console.log('yandex metrika has been found ', hash);
        console.log('prototype: ', group);

        // @ts-ignore
        ym(99437467, 'userParams', {
          group: group
        });

        setUsePopup(usePopupDialogs);
        setReviewsToUp(reviewsToUpFlag);
      } else {
        console.error("Счетчик Яндекс Метрики не найден или не загружен.");
      }
    }, 5000);    
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path={APP_ROUTES.MAIN} element={<MainPage usePopup={usePopup} />} />
        <Route path={'/HTML_Academy_City_rent'} element={<MainPage usePopup={usePopup} />}/>
        <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={'/HTML_Academy_City_rent/login'} element={<LoginPage />}/>
        <Route
          path={APP_ROUTES.FAVORITES}
          element={<PrivateRoute element={<FavoritesPage />} />}
        />
        <Route path={'/HTML_Academy_City_rent/favorites'} element={<PrivateRoute element={<FavoritesPage />} />}/>
        <Route 
          path={APP_ROUTES.OFFER(':id')} 
          element={<OfferPage reviewsToUp={reviewsToUp} />} 
        />
        <Route 
          path={'/HTML_Academy_City_rent' + APP_ROUTES.OFFER(':id')} 
          element={<OfferPage reviewsToUp={reviewsToUp} />} 
        />
        <Route path="/*" element={<Error404 description="Error" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
