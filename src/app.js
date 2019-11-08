import{GraphQLServer} from "graphql-yoga"
import dateTime from "date-time"

let autorData = [];
let ingredienteData = [];
let recetaData=[];

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
    recetas: [Receta!]!
}
type Query{
    autores: [Autor!]!
    ingredientes: [Ingrediente!]!
    recetas(ingrediente: String, autor: String): [Receta!]!
}
type Mutation{
    addAutor(nombre:String!,email:String!): Autor!
    addIngrediente(nombre:String!):Ingrediente!
    addReceta(titulo:String!,descripcion:String!,autor:String!,ingredientes:[String!]!):Receta!
}
`

const resolvers={
    Receta:{
        autor: (parent,args,ctx,info)=>{
            const autorNombre = parent.autor;
            return autorData.find(obj=>obj.nombre === autorNombre);
        },
        ingredientes:(parent,args,ctx,info)=>{
            const ingredientesNombre = parent.name;
            return ingredienteData.filter(obj=>ingredientesNombre.includes(obj.nombre));
        }
    },
    Autor:{
        recetas: (parent,args,ctx,info)=>{
            const recetaNombre = parent.recetas;
            return recetaData.filter(obj=>obj.autor === recetaNombre);
        }
    },
    Mutation:{
        addAutor:(parent,args,ctx,info)=>{
            const{nombre,email} = args;
            if(autorData.some(obj => obj.email === email)){
                throw new Error (`el correo: ${email} ya esta en uso`);
            }
            const autor = {
                nombre,
                email,
            };
            autorData.push(autor);
            return autor;
        },
        addIngrediente:(parent,args,ctx,info)=>{
            if(ingredienteData.some(obj=>obj.nombre === args.nombre)){
                throw new Error (`el ingrediente ${args.nombre} ya existe`);
            }
            const ingrediente = {
                nombre: args.nombre,
            };
            ingredienteData.push(ingrediente);
            return ingrediente;
        },
        addReceta:(parent,args,ctx,info)=>{
            const{titulo,autor,ingredientes,descripcion} = args;
            if(recetaData.some(obj=>obj.titulo === titulo)){
                throw new Error (`la receta ${titulo} ya existe`);
            }
            if(!autorData.some(obj => obj.nombre === autor)){
                throw new Error(`no hay ningun autor llamado ${autor}`);
            }
            ingredientes.forEach(element => {
                if(!ingredienteData.some(obj => obj.nombre === element)){
                    throw new Error (`no existe el ingrediente ${element}`);
                } 
            });
            
            const receta ={
                titulo,
                descripcion,
                fecha : dateTime(),
                ingredientes,
                autor,
            };
            recetaData.push(receta);
            return receta;
        }
    },
    Query:{
        autores:()=>{
            return autorData;
        },
        ingredientes:()=>{
            return ingredienteData;
        },
        recetas:(parent,args,ctx,info)=>{
            const result = recetaData;
            if(args.ingrediente){
                result = result.filter(obj => obj.ingredientes.includes(args.ingrediente));
            }

            if(args.autor){
                 result = result.filter(obj=> obj.autor.name === autor);
            }
            return result;
        }
    },
}
const server = new GraphQLServer({typeDefs,resolvers});
server.start(() => console.log("Server started"));
