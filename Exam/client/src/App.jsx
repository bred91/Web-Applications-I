//import './App.css'
import './MyCSS.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react'
import MyNav from './components/MyNav';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap'
import { LoginForm } from './components/AuthComponents';
import { ToastContainer, toast } from 'react-toastify';
import { DefaultRoute, MainLayout, NotFoundRoute, LoadingLayout } from './components/PageLayout';
import API from './API';
import MyForm from './components/MyForm';

function App() {
  const [dirty, setDirty] = useState(true);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(undefined);
  const [loggedIn, setLoggedIn] = useState(false);
  const [pages, setPages] = useState([]);

  const [contentTypesList, setContentTypesList] = useState([]);                            // content types list
  const [imagesList, setImagesList] = useState([]);                                       // images list  

  // check if user is already logged in
  // if so, set the user and the login status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // here you have the user info, if already logged in
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch (err) {
        // NO need to do anything: user is simply not yet authenticated
        //handleError(err);
      }
    };
    checkAuth();
  }, []);


  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser(undefined);
    toast.info('See you soon!', { autoClose: 2000 })
  }


  const loginSuccessful = (user) => {
    setUser(user);
    setLoggedIn(true);
    setDirty(true);
    toast.success(`Welcome back ${user.name}!`, { autoClose: 2000 });
  }

  // delete a page
  const deletePage = (id) => {
    setPages(pages.map((page) => {
      if (page.id === id) {
        page.pageStatus = 'deleted';
        return page;
      }
      return page;
    }));

    API.deletePage(id)
      .then(() => {
        toast.success('Page deleted successfully', { autoClose: 2000 });
        setDirty(true);
      })
      .catch(() => toast.error('Error deleting page', { autoClose: 2000 }));
  }

  // useEffect to get the content types and the images list from the server
  useEffect(() => {
    API.getContent()
      .then((content) => {
        setContentTypesList(content.contentTypes);
        setImagesList(content.images);
      })
      .catch((err) => {
        toast.error(err);
      })
  }, []);

  // useEffect to get the pages from the server
  useEffect(() => {
    if (dirty) {
      API.getPages()
        .then(pages => {
          setPages(pages);
          setDirty(false);
          setLoading(false);
        })
        .catch();
    }
  }, [dirty]);

  return (
    <BrowserRouter>
      <Container fluid className='App'>
        <MyNav user={user} logout={doLogOut} />
        <ToastContainer
          position="bottom-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <Routes>
          {/* parent route */}
          <Route path='/' element={loading ? <LoadingLayout /> : <DefaultRoute loggedIn={loggedIn} dirty={dirty} />} >
            {/* default child route for the parent one */}
            <Route index element={<MainLayout loggedIn={loggedIn} user={user} pages={pages} imagesList={imagesList} />} />
            <Route path='backoffice' element={<MainLayout loggedIn={loggedIn} user={user} pages={pages} backoffice={true} deletePage={deletePage} imagesList={imagesList} />} />
            <Route path='backoffice/add' element={<MyForm imagesList={imagesList} contentTypesList={contentTypesList} user={user} pages={pages} setPages={setPages} setDirty={setDirty} />} />
            <Route path='backoffice/edit/:pageId' element={<MyForm imagesList={imagesList} contentTypesList={contentTypesList} user={user} pages={pages} setPages={setPages} setDirty={setDirty} deletePage={deletePage} />} />
            {/* it will match only if no other routes do */}
            <Route path='*' element={<NotFoundRoute />} />
          </Route>
          <Route path='/login' element={loggedIn ? <Navigate replace to='/' /> : <LoginForm loginSuccessful={loginSuccessful} />} />
        </Routes>
      </Container>
    </BrowserRouter>
  )
}

export default App
