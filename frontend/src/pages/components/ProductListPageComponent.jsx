import { Container, Row, Col, ListGroup, Button } from "react-bootstrap";
import SortOptionsComponent from "../../components/SortOptionsComponent";
import PriceFilterComponent from "../../components/filtersQueryResultOptions/PriceFilterComponent";
import RatingFilterComponent from "../../components/filtersQueryResultOptions/RatingFilterComponent";
import AttributesFilterComponent from "../../components/filtersQueryResultOptions/AttributesFilterComponent";
import CategoryFilterComponent from "../../components/filtersQueryResultOptions/CategoryFilterComponent";
import ProductForListComponent from "../../components/ProductForListComponent";
import PaginationComponent from "../../components/PaginationComponent";

import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const ProductListPageComponent = ({ getProducts, categories }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attrsFilter, setAttrsFilter] = useState([]);
  const [attrsFromFilter, setAttrsFromFilter] = useState([]);
  const [showResetFiltersButton, setShowResetFiltersButton] = useState(false);

  const [filters, setFilters] = useState([]);
  const [price, setPrice] = useState(500);
  const [ratingsFromFilter, setRatingsFromFilter] = useState({});
  const [categoriesFromFilter, setCategoriesFromFilter] = useState({});
  const [sortOption, setSortOption] = useState("");
  const [paginationLinksNumber, setPaginationLinksNumber] = useState(null);
  const [pageNum, setPageNum] = useState(null);

  const { categoryName } = useParams() || "";
  const { pageNumParam } = useParams() || 1;
  const { searchQuery } = useParams() || "";

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (categoryName) {
      let categoryAllData = categories.find(
        (item) => item.name === categoryName.replace(/,/g, "/")
      );
      if (categoryAllData) {
        let mainCategory = categoryAllData.name.split("/")[0];
        let index = categories.findIndex((item) => item.name === mainCategory);
        setAttrsFilter(categories[index].attrs);
      } else {
        setAttrsFilter([]);
      }
    }
  }, [categoryName, categories]);

  useEffect(() => {
    if (Object.entries(categoriesFromFilter).length > 0) {
      setAttrsFilter([]);
      var cat = [];
      var count;
      Object.entries(categoriesFromFilter).forEach(([category, checked]) => {
        if (checked) {
          var name = category.split("/")[0];
          cat.push(name);
          count = cat.filter((x) => x === name).length;
          if (count === 1) {
            var index = categories.findIndex((item) => item.name === name);
            setAttrsFilter((attrs) => [...attrs, ...categories[index].attrs]);
          }
        }
      });
    }
  }, [categoriesFromFilter, categories]);

  useEffect(() => {
    getProducts(categoryName, pageNumParam, searchQuery, filters, sortOption)
      .then((products) => {
        setProducts(products.products);
        setPaginationLinksNumber(products.paginationLinksNumber);
        setPageNum(products.pageNum);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError(true);
      });
  }, [categoryName, pageNumParam, searchQuery, filters, sortOption]);

  const handleFilters = () => {
    navigate(location.pathname.replace(/\/[0-9]+$/, ""));
    setShowResetFiltersButton(true);
    setFilters({
      price: price,
      rating: ratingsFromFilter,
      category: categoriesFromFilter,
      attrs: attrsFromFilter,
    });
  };

  const resetFilters = () => {
    setShowResetFiltersButton(false);
    setFilters({});
    window.location.href = "/product-list";
  };

  return (
    <Container>
      <Row>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item className="mt-3 mb-3">
              <SortOptionsComponent setSortOption={setSortOption} />
            </ListGroup.Item>

            <ListGroup.Item>
              FILTER:
              <br />
              <PriceFilterComponent price={price} setPrice={setPrice} />
            </ListGroup.Item>

            <ListGroup.Item>
              <RatingFilterComponent
                setRatingsFromFilter={setRatingsFromFilter}
              />
            </ListGroup.Item>

            {!location.pathname.match(/\/category/) && (
              <ListGroup.Item>
                <CategoryFilterComponent
                  setCategoriesFromFilter={setCategoriesFromFilter}
                />
              </ListGroup.Item>
            )}

            <ListGroup.Item>
              <AttributesFilterComponent
                attrsFilter={attrsFilter}
                setAttrsFromFilter={setAttrsFromFilter}
              />
            </ListGroup.Item>

            <ListGroup.Item>
              <Button variant="primary" onClick={handleFilters}>
                Filter
              </Button>

              {showResetFiltersButton && (
                <>
                  {" "}
                  <Button variant="danger" onClick={resetFilters}>
                    Reset filters
                  </Button>
                </>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={9}>
          {loading ? (
            <h2>Loading products...</h2>
          ) : error ? (
            <h2>Error while loading products. Try again later.</h2>
          ) : (
            products.map((product) => (
              <ProductForListComponent key={product._id} product={product} />
            ))
          )}

          {paginationLinksNumber > 1 ? (
            <PaginationComponent
              categoryName={categoryName}
              searchQuery={searchQuery}
              paginationLinksNumber={paginationLinksNumber}
              pageNum={pageNum}
            />
          ) : null}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductListPageComponent;
