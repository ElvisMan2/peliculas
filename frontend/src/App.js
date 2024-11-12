import React, { useEffect, useState } from "react";

function App() {
    const [peliculas, setPeliculas] = useState([]);
    const [nombre, setNombre] = useState("");
    const [año, setAño] = useState("");
    const [genero, setGenero] = useState("");

    useEffect(() => {
        obtenerPeliculas();
    }, []);

    const obtenerPeliculas = async () => {
        try {
            const response = await fetch("http://localhost:5000/peliculas");
            const data = await response.json();
            setPeliculas(data);
        } catch (error) {
            console.error("Error al obtener las películas:", error);
        }
    };

    const agregarPelicula = async () => {
        try {
            await fetch("http://localhost:5000/peliculas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre,
                    año_de_lanzamiento: año,
                    genero,
                }),
            });
            obtenerPeliculas();
        } catch (error) {
            console.error("Error al agregar la película:", error);
        }
    };

    const actualizarPelicula = async (id) => {
        try {
            await fetch(`http://localhost:5000/peliculas/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre,
                    año_de_lanzamiento: año,
                    genero,
                }),
            });
            obtenerPeliculas();
        } catch (error) {
            console.error("Error al actualizar la película:", error);
        }
    };

    const eliminarPelicula = async (id) => {
        try {
            await fetch(`http://localhost:5000/peliculas/${id}`, {
                method: "DELETE",
            });
            obtenerPeliculas();
        } catch (error) {
            console.error("Error al eliminar la película:", error);
        }
    };

    return (
        <div>
            <h1>CRUD de Películas</h1>
            <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <input placeholder="Año de Lanzamiento" value={año} onChange={(e) => setAño(e.target.value)} />
            <input placeholder="Género" value={genero} onChange={(e) => setGenero(e.target.value)} />
            <button onClick={agregarPelicula}>Agregar Película</button>

            <ul>
                {peliculas.map((pelicula) => (
                    <li key={pelicula.id}>
                        {pelicula.nombre} - {pelicula.año_de_lanzamiento} - {pelicula.genero} 
                        <button onClick={() => eliminarPelicula(pelicula.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
