import React, { useState } from "react";
import "./filter.css";
import axios from "axios";

const Filter = ({ setProductData }) => {
  const [searchKey, setSearchKey] = useState("");
  const [sort, setSort] = useState("popular");
  const [category, setCategory] = useState("all");

  const clickHandler = async () => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    try {
      const res = await axios.get(`${BACKEND_URL}/api/get-products`, {
        withCredentials: true,
      });

      let filteredproducts = res.data.products;

      if (searchKey) {
        filteredproducts = filteredproducts.filter((product) => {
          return product.name.toLowerCase().includes(searchKey);
        });
      }

      if (sort !== "popular") {
        if (sort === "htl") {
          filteredproducts = filteredproducts.sort((a, b) => {
            return -a.price + b.price;
          });
        } else {
          filteredproducts = filteredproducts.sort((a, b) => {
            return a.price - b.price;
          });
        }
      }

      if (category !== "all") {
        filteredproducts = filteredproducts.filter((product) => {
          return product.category.toLowerCase().includes(category);
        });
      }

      setProductData(filteredproducts);
    } catch (error) {
      console.log("errrr", error);
    }
  };

  return (
    <>
      <div className="filter-container">
        <div>
          <input
            value={searchKey}
            onChange={(e) => {
              setSearchKey(e.target.value);
            }}
            type="text"
            placeholder="search product"
          />
        </div>

        <div>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
            }}
          >
            <option value="popular">Popular</option>
            <option value="htl">High to Low</option>
            <option value="lth">Low to High</option>
          </select>
        </div>

        <div>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          >
            <option value="all">All</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="mobiles">Mobiles</option>
            <option value="games">Games</option>
          </select>
        </div>

        <div className="btn-cont">
          <p onClick={() => clickHandler(searchKey, sort, category)}>Filter</p>
        </div>
      </div>
    </>
  );
};

export default Filter;
