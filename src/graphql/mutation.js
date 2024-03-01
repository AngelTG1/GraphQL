const { GraphQLString, GraphQLID } = require("graphql");
const { User, Post, Comment } = require("../models")
const { createJWTToken } = require("../util/auth")
const { PostType, CommentType } = require("./types")

const register = {
    type: GraphQLString,
    description: "Register a new users and token",
    args: {
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        displayName: { type: GraphQLString },
    },
    async resolve(_, args) {
        const { username, email, password, displayName } = args

        const user = await User.create({username, email, password, displayName});
        await user.save()

        const token = createJWTToken({_id: user.id, username: user.username, email: user.email, })


        return token;
    }
}

const login = {
    type: GraphQLString,
    description: "Login a user and token return",
    args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
    },
    async resolve(_, args) {
        
        const user = await User.findOne({email: args.email}).select('+password')

        if (!user || args.password !== user.password) throw new Error('User not found');

        const token = createJWTToken({_id: user.id, username: user.username, email: user.email, })

        return token  
    }
}

const createPost = {
    type: PostType,
    description: "Create a new Post",
    args: {
        title: {type: GraphQLString},
        body: {type: GraphQLString},
    },
    async resolve(_, args, { verifiedUser }) {
        console.log(verifiedUser)

        const post  = new Post({
            title: args.title,
            body: args.body,
            authorId: verifiedUser._id,
        })


        await post.save();
        

        return post;
    }
}

const updatePost = {
    type: PostType,
    description: "Update a post",
    args: {
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        body: { type: GraphQLString },
    },
    async resolve(_,{ id, title, body }, { verifiedUser }) {

        if(!verifiedUser) throw new Error("Unauthorized sorry :(");

        const updatePost =  await Post.findByIdAndUpdate(
            {_id: id, authorId: verifiedUser._id},
            {
                title,
                body
            },
            {
                new: true,
                runValidators: true,
            }
        )

        return updatePost

    }
}

const deletPost = {
    type: GraphQLString,
    description: "Delet a post",
    args: {
        postId: { type: GraphQLID },
    },
    async resolve(_, {postId}, {verifiedUser}) {
        if(!verifiedUser) throw new Error('Unauthorized sorry :(')

        const postDeleted = await Post.findOneAndDelete({
            _id: postId,
            authorId: verifiedUser._id,
        })

        if(!postDeleted) throw new Error('Post not found sorry')

        return "Post deleted"
    }   
}

const addComment = {
    type: CommentType,
    description: "Add a comment a post",
    args: {
        comment: { type: GraphQLString },
        postId: { type: GraphQLID },
    },
    async resolve(_,{ comment, postId }, { verifiedUser }) {
        const newComment = await new Comment({
            comment,
            postId,
            userId: verifiedUser._id
        })
        return newComment.save()
    }
}

const updateComment = {
    type: CommentType,
    description: "Update a comment",
    args: {
        id: { type: GraphQLID },
        comment:  { type: GraphQLString }
    },
    async resolve(_, { id, comment }, { verifiedUser }) {

        if(!verifiedUser) throw new Error('Unauthorized');
        
        const commentUpdate = await Comment.findOneAndUpdate(
            {
                _id: id,
                userId: verifiedUser._id,
            },
            {
                comment,
            },
        )

        if(!commentUpdate) throw new Error('Comment not found')

        return commentUpdate;
    }
}

const deletComment = {
    type: GraphQLString,
    description: "Delet a comment",
    args: {
        id: { type: GraphQLID }
    },
    async resolve(_, {id}, {verifiedUser}) {
        if(!verifiedUser) throw new Error('Unauthorized')

        const commentDeleted = await Comment.findOneAndDelete({
            _id: id,
            userId: verifiedUser._id
        })

        if(!commentDeleted) throw new Error('Comment not found')

        return "Comment deleted"
    }
}

module.exports = {
    register, 
    login,
    createPost,
    updatePost,
    deletPost,
    addComment,
    updateComment,
    deletComment,
}