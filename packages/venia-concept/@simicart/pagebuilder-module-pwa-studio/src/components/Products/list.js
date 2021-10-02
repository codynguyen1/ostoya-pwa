import React from 'react';
import { useProducts } from '../../hooks/useProducts';
import GalleryItem from '@magento/venia-ui/lib/components/Gallery/item';
import defaultClasses from './list.css';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

const ProductList = props => {
    const { item, formatMessage } = props;
    let filterData = { category_id: { eq: '6' } };
    let sortData;
    let pageSize = 12;
    if (item.dataParsed) {
        const { dataParsed } = item;
        if (dataParsed.openProductsWidthSKUs) {
            let openProductsWidthSKUs = item.dataParsed.openProductsWidthSKUs;
            openProductsWidthSKUs = openProductsWidthSKUs.trim();
            openProductsWidthSKUs = openProductsWidthSKUs.split(',');
            filterData = {
                sku: {
                    in: openProductsWidthSKUs
                }
            };
        } else if (dataParsed.openCategoryProducts) {
            filterData = {
                category_id: { eq: String(dataParsed.openCategoryProducts) }
            };
        }
        if (dataParsed.openProductsWidthSortAtt) {
            const directionToSort = dataParsed.openProductsWidthSortDir
                ? dataParsed.openProductsWidthSortDir.toUpperCase()
                : 'ASC';
            sortData = {};
            sortData[dataParsed.openProductsWidthSortAtt] = directionToSort;
        }
        if (dataParsed.openProductsWidthSortPageSize) {
            pageSize = parseInt(dataParsed.openProductsWidthSortPageSize);
        }
    }

    const { data, loading, storeConfig } = useProducts({
        filterData,
        sortData,
        pageSize
    });
    const classes = mergeClasses(defaultClasses, props.classes);

    if (
        data &&
        data.products &&
        data.products.items &&
        data.products.items.length &&
        storeConfig
    ) {
        const name = formatMessage({ val: item.name });
        console.log(storeConfig)
        return (
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    overflow: 'hidden'
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        width: '100%',
                        marginBottom: 15,
                        justifyContent: 'space-between'
                    }}
                >
                    {name}
                </div>
                <div
                    style={{
                        display: 'flex',
                        width: '100%',
                        flexWrap: 'nowrap',
                        overflow: 'auto'
                    }}
                >
                    {data.products.items.map((productItem, indx) => {
                        return (
                            <GalleryItem
                                key={indx}
                                item={productItem}
                                classes={classes}
                                formatMessage={formatMessage}
                                storeConfig={storeConfig}
                            />
                        );
                    })}
                </div>
            </div>
        );
    } else if (loading) {
        return <LoadingIndicator />;
    }
    return '';
};

export default ProductList;
