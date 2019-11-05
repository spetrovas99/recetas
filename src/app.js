import{GraphQLServer} from "graphql-yoga"
import * as uuid from "uuid"
import dateTime from "date-time"

const autorData= [];

const typeDefs =
`
type Receta{
    titulo: String!
    descripcion: String!
    fecha: String!
    autor: Autor!
    ingredientes: Ingrediente!
}
type Autor{
    nombre: String!
    email: String!
    recetas: [Receta!]!
}
type Ingrediente{
    nombre: String!
    recetas: [Receta!]
}
type Mutation{
    addAutor(nombre:String!,email:String!): Autor!
}
`
const resolvers={
    Mutation:{
        addAutor:(parent,args,ctx,info)=>{
           // const{name,email} = args;
            if(authorData.some(obj => obj.email === email)){
                throw new Error (`user email ${email} already in use`);
            }
            const autor = {
                nombre : args.nombre,
                email : args.email,
                id: uuid.v4()
            };
            authorData.push(autor);
            return autor;
        }
    }
}
const server = new GraphQLServer({typeDefs,resolvers});
server.start(() => console.log("Server started"));
