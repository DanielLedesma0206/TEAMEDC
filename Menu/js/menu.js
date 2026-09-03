function abrirModo(modo) {

    switch (modo) {

        case "Juego Libre":

            alert(
                "Has seleccionado JUEGO LIBRE.\n\n" +
                "Aquí podrás ensamblar tu propia computadora."
            );

            break;


        case "Modo Estudio":

            alert(
                "Has seleccionado MODO ESTUDIO.\n\n" +
                "Aquí aprenderás los fundamentos de arquitectura de computadoras."
            );

            break;


        case "Prácticas":

            alert(
                "Has seleccionado PRÁCTICAS.\n\n" +
                "Aquí realizarás actividades interactivas."
            );

            break;


        case "Evaluación":

            alert(
                "Has seleccionado EVALUACIÓN.\n\n" +
                "Aquí podrás comprobar tus conocimientos."
            );

            break;


        case "Desafíos":

            alert(
                "Has seleccionado DESAFÍOS.\n\n" +
                "Aquí resolverás problemas de arquitectura."
            );

            break;


        case "Biblioteca":

            alert(
                "Has seleccionado BIBLIOTECA.\n\n" +
                "Aquí encontrarás material de consulta."
            );

            break;


        default:

            alert("Modo no disponible.");

    }

}
