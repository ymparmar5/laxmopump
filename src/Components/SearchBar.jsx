import { useContext, useState } from "react";
import myContext from "../Context/myContext";
import { useNavigate } from "react-router-dom";
import "../Style/SearchBar.css"; //

const SearchBar = () => {
    const context = useContext(myContext);
    const { getAllProduct } = context;

    const [search, setSearch] = useState("");

    const filterSearchData = getAllProduct.filter((obj) => obj.title.toLowerCase().includes(search.toLowerCase())).slice(0, 8);

    const navigate = useNavigate();

    return (
        <div className="search-bar-container">
            <div className="input-container">
                <input
                    type="text"
                    value={search}
                    placeholder='Search here'
                    onChange={(e) => setSearch(e.target.value)}
                    className='search-input'
                />
            </div>
            <div className="dropdown-container">
                {search && <div className="search-dropdown">
                    {filterSearchData.length > 0 ? (
                        filterSearchData.map((item, index) => (
                            <div
                                key={index}
                                className="dropdown-item"
                                onClick={() => navigate(`/productinfo/${item.id}`, setSearch(""))}
                            >
                                <div className="item-content">
                                    <img className="item-image" src={item.imgurl1} alt="" />
                                    {item.title.slice(0, 28)}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">
                            <img className="no-results-image" src="https://cdn-icons-png.flaticon.com/128/10437/10437090.png" alt="No results" />
                        </div>
                    )}
                </div>}
            </div>
        </div>
    );
}

export default SearchBar;
