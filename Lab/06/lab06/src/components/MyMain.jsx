import MyTable from "./MyTable";
import MyForm from "./MyForm";
import { useState } from "react";
import { Button } from "react-bootstrap";
import selected_lst from "../MyFilter";

function MyMain(props) {
    const [showForm, setShowForm] = useState(false);
    const [plusVisible, setPlusVisible] = useState(true);
    const [updateFilm, setUpdateFilm] = useState(null);
  
    const handleForm = (b) => {
      setShowForm(b);
      setPlusVisible(!b);
      setUpdateFilm(null);
    }
  
    function editFilmShows(film) {
      setShowForm(true);
      setPlusVisible(false);
      setUpdateFilm(film);
      //console.log(film);
    }
  
    const closeForm = () => {
      setShowForm(false);
      setPlusVisible(true);
      //setUpdateFilm(null);
    }
    
    return (
      // Main content
      <main className="col-md-9 col-12 below-nav">
        <h1 className="mb-2" id="filter-title">{selected_lst[props.selected]}</h1>
  
        <MyTable listOfFilms={props.filmLista} editFilm={editFilmShows} plusVisible={plusVisible}/>
        
  
        {showForm ? <MyForm film={updateFilm} editFilm={props.editFilm} listOfFilms={props.filmLista} addToList={props.addToList} closeForm={closeForm}/> 
            : <Button type="button" className="btn btn-dark fixed-right-bottom" onClick={() => handleForm(true)}>&#43;</Button>}   
      </main>
    );
}

export default MyMain;