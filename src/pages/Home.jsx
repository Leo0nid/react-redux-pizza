import React from 'react'
import axios from 'axios'
import {  useSelector , useDispatch  } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as qs from 'qs'
import  { setCategoryId ,setCurrentPage,setPageCount } from '../components/redux/slices/filterSlice'

import Categories from '../components/Categories';
import Sort from '../components/Sort';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton'
import Pagination from '../components/Pagination/index'
import { SearchContext } from '../App'

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { categoryId , sort , currentPage } = useSelector((state) => state.filter );
    //выносим состояние из категорииАйди
    const sortType = useSelector((state) => sort.sortProperty);


  const {searchValue} = React.useContext(SearchContext)

    const [items, setItems] = React.useState([]);
    const [isLoading, setLoading] = React.useState(true)

   

    const onChangeCategories = (id) => {
      dispatch(setCategoryId(id))
    }
    const onChangePage = number => {
      dispatch(setCurrentPage(number));
    }

  React.useEffect(()=> {
    if(window.location.search) {
      const params = qs.parse
    }
  }, [])






  React.useEffect(() => {
    setLoading(true);

    const order = sortType.includes('-') ? 'asc' : 'desc';
    const sortBy = sortType.replace('-', '');
    const category = categoryId > 0 ? `category=${categoryId}` : '';
    const search = searchValue  ? `&search=${searchValue}` : '';


    axios.get(`https://6447f8247bb84f5a3e4eb107.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`
    )
      .then((res) => {
        setItems(res.data);
          setLoading(false);
      })


    window.scrollTo(0 , 0);
  },[categoryId ,sortType, searchValue, currentPage])

  React.useEffect(() => {
    const queryString = qs.stringify({
      sortProperty: sort.sortProperty,
      categoryId,
      currentPage,
    })
    navigate(`?${queryString}`)

  },[categoryId ,sortType, currentPage])
  const pizzas = items.map((obj) =>  
    <PizzaBlock 
    key={obj.id}
    id={obj.id}
    title={obj.title} 
    price={obj.price} 
    image={obj.imageUrl}
    size={obj.sizes}
    types={obj.types}/>);


  const skeletons = [...new Array(6)].map((_,index) => <Skeleton key = {index}/>);
    return(
    <>
    <div className="content__top">
    <Categories value={categoryId} onChangeCategories = { onChangeCategories } />
    <Sort  />
  </div>
  <h2 className="content__title">Все пиццы</h2>
  <div className="content__items"> {isLoading ? skeletons : pizzas} </div>
    <Pagination currentPage={currentPage} onChangePage={onChangePage}/>
  </>
    )

}

export default Home;