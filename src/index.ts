import { ApolloServer, IResolvers, gql } from "apollo-server";


const typeDefs = gql `
    enum PhotoCategory {
        SELFIE
        PORTRAIT
        ACTION
        LANDSCAPE
        GRAPHIC
    }

    type Photo {
        id: ID!
        name: String!
        url: String!
        description: String
        category: PhotoCategory!
        postedBy: User!
    }

    type User {
        githubLogin: ID!
        name: String
        avatar: String
        postedPhotos: [Photo!]!
    }

    type Query {
        totalPhotos: Int!
        allPhotos: [Photo!]!
    }

    input PostPhotoInput {
        name: String!
        category: PhotoCategory=PORTRAIT
        description: String
    }

    type Mutation {
        postPhoto(input: PostPhotoInput): Photo!
    }
`;

interface User {
    githubLogin: string;
    name?: string;
    avatar?: string;
}

interface Photo {
    id: number;
    name: string;
    description?: string;
    category: string;
    githubUser: string;
}

let _id = 3;
const photos: Photo[] = [
    {
        id: 1,
        name: "sample1",
        category: "ACTION",
        githubUser: "gPlake",
    },
    {
        id: 2,
        name: "sample2",
        category: "SELFIE",
        githubUser: "sSchmidt"
    },
    {
        id: 3,
        name: "sample3",
        description: "this is sample",
        category: "LANDSCAPE",
        githubUser: "sSchmidt"
    }
];

const users: User[] = [
    {
        githubLogin: "mHattrup",
        name: "Mike Hattrup"
    },
    {
        githubLogin: "gPlake",
        name: "Glen Plake",
    },
    {
        githubLogin: "sSchmidt",
        name: "Scot Schmidt"
    }
];


const resolvers: IResolvers = {
    Query: {
        totalPhotos: () => photos.length,
        allPhotos: () => photos
    },

    Mutation: {
        postPhoto(parent, args) {
            const newPhoto = {
                id: _id++,
                ...args.input
            }
            photos.push(newPhoto);
            return newPhoto;
        }
    },

    Photo: {
        url: parent => `http://hoge.com/img/${parent.id}.jpg`,
        postedBy: (parent: Photo) => {
            return users.find(u => u.githubLogin === parent.githubUser);
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server
    .listen()
    .then(({url}) => console.log(`GraphQL Service running on ${url}`));