import Pagination from "react-bootstrap/Pagination";
import { LinkContainer } from "react-router-bootstrap";

const Paginate = ({ pages, page, isAdmin = false, keyword = "" }) => {
  return (
    pages > 1 && (
      <Pagination className="pagination">
        <LinkContainer
          to={
            !isAdmin
              ? keyword
                ? `/search/${keyword}/page/${page - 1}`
                : `/page/${page - 1}`
              : `/admin/productList/${page - 1}`
          }
        >
          <Pagination.Prev
            disabled={page === 1}
            activeLabel=""
            active={false}
          />
        </LinkContainer>

        {[...Array(pages).keys()].map((p) => (
          <LinkContainer
            key={p + 1}
            to={
              !isAdmin
                ? keyword
                  ? `/search/${keyword}/page/${p + 1}`
                  : `/page/${p + 1}`
                : `/admin/productList/${p + 1}`
            }
          >
            <Pagination.Item active={p + 1 === page} activeLabel="">
              {p + 1}
            </Pagination.Item>
          </LinkContainer>
        ))}
        <LinkContainer
          to={
            !isAdmin
              ? keyword
                ? `/search/${keyword}/page/${page + 1}`
                : `/page/${page + 1}`
              : `/admin/productList/${page + 1}`
          }
        >
          <Pagination.Next
            disabled={page === pages}
            activeLabel=""
            active={false}
          />
        </LinkContainer>
      </Pagination>
    )
  );
};

export default Paginate;
