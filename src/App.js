import React, {useEffect, useState} from "react";
import './App.css';
import Tmdb from "./Tmdb";
import MovieRow from "./components/MovieRow/MovieRow"
import FeaturedMovie from "./components/FeaturedMovie/FeaturedMovie";
import Header from "./components/Header/Header";

export default () =>{

    const [movieList, setMovieList] = useState([]);
    const [featuredData, setFeaturedData] = useState(null);
    const [blackHeader, setBlackHeader] = useState(false); // quando ta falso n aparece o fundo do Header, quando entra o true aparece

    useEffect(()=>{
        const loadAll = async () => {
            // pegando a lista total dos filmes
            let list = await Tmdb.getHomeList();
            setMovieList(list)

            // pegando o feature(filme em destaque)
            let originals = list.filter(i=>i.slug === 'originals')
            let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
            let chosen = originals[0].items.results[randomChosen];
            let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv')
            setFeaturedData(chosenInfo);
        }

        loadAll();
    }, []);
    // controla o falso e true do blackground de Header
    useEffect(()=>{
        const scrollListener = () => {
            if (window.scrollY > 10){
                setBlackHeader(true);
            } else {setBlackHeader(false);}
        }
        window.addEventListener('scroll', scrollListener)
        return () => {
            window.removeEventListener('scroll', scrollListener)
        }
    },[]);



    return (
        <div className="page">
            
            <Header black={blackHeader}/>

            {featuredData &&
               <FeaturedMovie item={featuredData}/>
            }

            <section className="lists">
                {movieList.map((item, key)=>(
                    <MovieRow key={key} title={item.title} items={item.items}/>
                ))}
            </section>
            <footer>
                Feito por Lucas Hiroshi Itikawa, curso da B7Web <br/>
                Direitos de imagem para Netflix<br/>
                Dados pegos no site Themoviedb.org
            </footer>
        </div>
    );
}