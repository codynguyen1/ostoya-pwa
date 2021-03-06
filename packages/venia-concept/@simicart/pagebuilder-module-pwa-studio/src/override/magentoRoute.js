import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useMagentoRoute } from '@magento/peregrine/lib/talons/MagentoRoute';

import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import RootShimmerComponent from '@magento/venia-ui/lib/RootComponents/Shimmer';
import { useLocation, Link, useHistory } from 'react-router-dom';
import { usePbFinder, PageBuilderComponent } from 'simi-pagebuilder-react';
import ProductList from '../components/Products/list';
import ProductGrid from '../components/Products/grid';
import Category from '../components/Category';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
import { ProductScroll } from '../components/Products/scroll';
import { CategoryScroll } from '../components/Category/scroll';
const storage = new BrowserPersistence();
const storeCode = storage.getItem('store_view_code') || STORE_VIEW_CODE;

const endPoint = 'https://tapita.io/pb/graphql/';
const integrationToken = '69XyhS7MKHjaDnNx5ogRrBBu92e9aBSf1632758339';

const MESSAGES = new Map()
    .set(
        'NOT_FOUND',
        "Looks like the page you were hoping to find doesn't exist. Sorry about that."
    )
    .set('INTERNAL_ERROR', 'Something went wrong. Sorry about that.');

const MagentoRoute = () => {
    const location = useLocation();
    const {
        loading: pbLoading,
        pageMaskedId,
        findPage,
        pathToFind,
        pageData
    } = usePbFinder({
        endPoint,
        integrationToken,
        storeCode,
        getPageItems: true
    });
    const { formatMessage } = useIntl();
    const talonProps = useMagentoRoute();
    const {
        component: RootComponent,
        isLoading,
        isNotFound,
        isRedirect,
        shimmer,
        initial,
        hasError,
        ...componentData
    } = talonProps;

    useEffect(() => {
        if (
            location &&
            location.pathname &&
            (isNotFound || location.pathname === '/' || hasError)
        ) {
            if (!pageMaskedId || location.pathname !== pathToFind)
                findPage(location.pathname);
        }
    }, [location, pageMaskedId, isNotFound, pathToFind, findPage, hasError]);

    if (
        pageMaskedId &&
        pageMaskedId !== 'notfound' &&
        (isNotFound || location.pathname === '/' || hasError)
    ) {
        try {
            if (document.getElementsByTagName('header')[0])
                document.getElementsByTagName(
                    'header'
                )[0].nextSibling.style.maxWidth = 'unset';
        } catch (err) {
            console.warn(err);
        }
        return (
            <React.Fragment>
                <PageBuilderComponent
                    key={pageMaskedId}
                    endPoint={endPoint}
                    maskedId={pageMaskedId}
                    pageData={
                        pageData && pageData.publish_items ? pageData : false
                    }
                    ProductList={ProductList}
                    ProductGrid={ProductGrid}
                    ProductScroll={ProductScroll}
                    CategoryScroll={CategoryScroll}
                    Category={Category}
                    formatMessage={formatMessage}
                    Link={Link}
                    history={history}
                />
            </React.Fragment>
        );
    } else if (pbLoading) {
        return fullPageLoadingIndicator;
    }
    try {
        if (document.getElementsByTagName('header')[0])
            document.getElementsByTagName(
                'header'
            )[0].nextSibling.style.maxWidth = '1440px';
    } catch (err) {
        console.warn(err);
    }

    if (isLoading || isRedirect) {
        // Show root component shimmer
        if (shimmer) {
            return <RootShimmerComponent type={shimmer} />;
        }

        return initial ? null : <RootShimmerComponent />;
    } else if (RootComponent) {
        return <RootComponent {...componentData} />;
    }  else if (isNotFound) {
        if (!pageMaskedId && location && location.pathname) {
            return fullPageLoadingIndicator;
        }
        return (
            <ErrorView
                message={formatMessage({
                    id: 'magentoRoute.routeError',
                    defaultMessage: MESSAGES.get('NOT_FOUND')
                })}
            />
        );
    }

    return (
        <ErrorView
            message={formatMessage({
                id: 'magentoRoute.internalError',
                defaultMessage: MESSAGES.get('INTERNAL_ERROR')
            })}
        />
    );
};

export default MagentoRoute;
