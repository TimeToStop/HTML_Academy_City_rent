
import { useCallback, useEffect, useMemo, useState } from 'react';
import ReviewList from '../../components/review/riviews-list.tsx';
import Map from '../../components/map/map.tsx';
import OffersList from '../../components/offers-list/offers-list.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/header/header.tsx';
import Rating from '../../components/rating/rating.tsx';
import Spinner from '../../components/spinner/spinner.tsx';
import { useAppDispatch, useAppSelector } from '../../store/hooks/hooks.ts';
import { fetchOffer, setFavoriteStatus } from '../../store/action.ts';
import convertOffersToPoints from '../../utils/convert-offers-to-points/convert-offers-to-points.tsx';
import ReviewForm from '../../components/review/review-form.tsx';
import { APP_ROUTES } from '../../services/constants.ts';
import Error404 from '../Error404/Error404.tsx';

interface OfferPageProps {
  reviewsToUp: boolean; 
}

const OfferPage = ({ reviewsToUp }: OfferPageProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const authorizationStatus = useAppSelector(
    (state) => state.userSlice.authorizationStatus
  );
  const { offer, comments, nearbyOffers, offerLoading, offerError } =
    useAppSelector((state) => state.offerSlice);

  useEffect(() => {
    if (id) {
      dispatch(fetchOffer(id));
    }
  }, [id, dispatch]);

  const nearbyPoints = useMemo(
    () => convertOffersToPoints(nearbyOffers),
    [nearbyOffers]
  );

  const activePoint = useMemo(
    () => (offer ? convertOffersToPoints([offer]) : undefined),
    [offer]
  );

  const handleToggleFavoriteStatus = useCallback(() => {
    if (authorizationStatus && offer) {
      dispatch(
        setFavoriteStatus({
          offerId: offer.id,
          status: offer.isFavorite ? 0 : 1,
          isMainPage: false,
        })
      );
    } else {
      navigate(APP_ROUTES.LOGIN);
    }
  }, [dispatch, navigate, offer, authorizationStatus]);

  if (offerLoading && !offerError) {
    return <Spinner variant="page" />;
  }

  if (!offer || offerError) {
    return <Error404 description={'Offer not found'} />;
  }

  const selectedImages =
    offer.images.length > 6 ? offer.images.slice(0, 6) : offer.images;

  return (
    <div className="page">
      <Header />
      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {selectedImages.map((image) => (
                <div className="offer__image-wrapper" key={image}>
                  <img className="offer__image" src={image} alt={image} />
                </div>
              ))}
            </div>
          </div>
          <div className="offer__container container">
            <div className="offer__wrapper">
              {offer.isPremium ? (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              ) : null}
              <div className="offer__name-wrapper">
                <h1 className="offer__name">{offer.title}</h1>
                <button
                  className={`offer__bookmark-button${
                    offer.isFavorite ? ' offer__bookmark-button--active' : ''
                  } button`}
                  onClick={handleToggleFavoriteStatus}
                >
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use xlinkHref="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">To bookmarks</span>
                </button>
              </div>
              <Rating
                value={offer.rating}
                showRawValue
                containerClassName="offer__rating"
                starsClassName="offer__stars"
              />
              { reviewsToUp && <section className="offer__reviews reviews">
                <h2 className="reviews__title">
                  Reviews &middot;{' '}
                  <span className="reviews__amount">{comments.length}</span>
                </h2>
                <ReviewList reviews={comments} />
                {authorizationStatus ? <ReviewForm offerId={id!} /> : null}
              </section>
              }
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {offer.type.charAt(0).toUpperCase() + offer.type.slice(1)}
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  {`${offer.bedrooms} Bedroom${
                    offer.bedrooms === 1 ? '' : 's'
                  }`}
                </li>
                <li className="offer__feature offer__feature--adults">
                  {`Max ${offer.maxAdults} adult${
                    offer.maxAdults === 1 ? '' : 's'
                  }`}
                </li>
              </ul>
              <div className="offer__price">
                <b className="offer__price-value">&euro;{offer.price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <ul className="offer__inside-list">
                  {offer.goods.map((item) => (
                    <li className="offer__inside-item" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div className="offer__avatar-wrapper offer__avatar-wrapper--pro user__avatar-wrapper">
                    <img
                      className="offer__avatar user__avatar"
                      src={offer.host.avatarUrl}
                      width="74"
                      height="74"
                      alt="Host avatar"
                    />
                  </div>
                  <span className="offer__user-name">{offer.host.name}</span>
                  {offer.host.isPro ? (
                    <span className="offer__user-status">Pro</span>
                  ) : null}
                </div>
                <div className="offer__description">
                  <p className="offer__text">{offer.description}</p>
                </div>
              </div>
            </div>
          </div>
          <section className="offer__map map">
            <Map
              city={offer.city}
              points={
                activePoint ? [...activePoint, ...nearbyPoints.slice(0, 3)] : []
              }
            />
          </section>
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">
              Other places in the neighbourhood
            </h2>
            <OffersList offers={nearbyOffers} type="Nearby" />
          </section>
        </div>
          { !reviewsToUp && <section className="offer__reviews reviews">
                <h2 className="reviews__title">
                  Reviews &middot;{' '}
                  <span className="reviews__amount">{comments.length}</span>
                </h2>
                <ReviewList reviews={comments} />
                {authorizationStatus ? <ReviewForm offerId={id!} /> : null}
        </section>}
      </main>
    </div>
  );
};

export default OfferPage;
