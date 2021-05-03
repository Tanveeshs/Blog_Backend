module.exports = (user,pass)=>
{
    return {
        'url': `mongodb+srv://${user}:${pass}@cluster0-pavbm.mongodb.net/easypg?retryWrites=true&w=majority`
    }
};
