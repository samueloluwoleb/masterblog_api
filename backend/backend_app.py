from json import JSONDecodeError

from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes


def load_data(file_path):
    """
        Loads the database.json file into the application
    :param file_path:
    :return:
    """
    with open(file_path, "r") as handle:
        return json.load(handle)


@app.route('/api/posts', methods=['POST'])
def add_posts():
    """
        Runs when a post request is sent by client to this endpoint to add new blogpost to the database.
        Generates id for the new post and returns the new post data back to client
    :return:
    """
    new_post = request.get_json()
    title = new_post.get('title')
    content = new_post.get('content')
    author = new_post.get('author')
    date = new_post.get('date')

    if content == '':
        return jsonify({"error": "Post content not found"}), 400
    if author == '':
        return jsonify({"error": "Post author not found"}), 400
    if title == '':
        return jsonify({"error": "Post author not found"}), 400
    if date != f"{datetime.today().date()}":
        date = f"{datetime.today().date()}"
        new_post['date'] = date
    try:
        blog_posts = load_data('posts.json')
    except JSONDecodeError:
        return jsonify({"message": "Oops, there is a problem. It is not you, we promise !!!"}), 500

    # Generate a new ID for the book
    new_id = max(post['id'] for post in blog_posts) + 1
    new_post['id'] = new_id
    new_post['likes'] = 0

    # Add the new book to our list
    blog_posts.append(new_post)
    json_data = json.dumps(blog_posts)

    with open("posts.json", "w") as fileobj:
        fileobj.write(json_data)

    # Return the new book data to the client
    return jsonify(new_post), 201


@app.route('/api/posts', methods=['GET'])
def get_posts():
    """
        Runs when the endpoint is triggered by client and returns the sorted or unsorted data fetched from the blogposts
        database to the client
    :return:
    """
    sort = request.args.get('sort', '')
    direction = request.args.get('direction')
    try:
        blog_posts = load_data('posts.json')
    except JSONDecodeError:
        return jsonify({"message": "Oops, there is a problem. It is not you, we promise !!!"}), 500

    if sort == '':
        return jsonify(blog_posts)

    # Sorts the blogposts data based on the sorting parameters provided by the request sent by client
    if sort == 'title' and direction == 'asc':
        sorted_posts = sorted(blog_posts, key=lambda x: x['title'])
    elif sort == 'title' and direction == 'desc':
        sorted_posts = sorted(blog_posts, key=lambda x: x['title'], reverse=True)
    elif sort == 'content' and direction == 'asc':
        sorted_posts = sorted(blog_posts, key=lambda x: x['content'])
    elif sort == 'content' and direction == 'desc':
        sorted_posts = sorted(blog_posts, key=lambda x: x['content'], reverse=True)
    elif sort == 'author' and direction == 'asc':
        sorted_posts = sorted(blog_posts, key=lambda x: x['author'])
    elif sort == 'author' and direction == 'desc':
        sorted_posts = sorted(blog_posts, key=lambda x: x['author'], reverse=True)
    elif sort == 'date' and direction == 'asc':
        sorted_posts = sorted(blog_posts, key=lambda x: datetime.strptime(x['date'], '%Y-%m-%d').date())
    elif sort == 'date' and direction == 'desc':
        sorted_posts = sorted(blog_posts, key=lambda x: datetime.strptime(x['date'], '%Y-%m-%d').date(), reverse=True)
    else:
        return jsonify(blog_posts)

    return jsonify(sorted_posts)


@app.route('/api/posts/<int:post_id>', methods=['DELETE'])
def delete(post_id):
    """
        Runs when the endpoint is visited by client, the provided id is used to locate the unique post and
        it is deleted from the database
    :param post_id:
    :return:
    """
    try:
        blog_posts = load_data('posts.json')
    except JSONDecodeError:
        return jsonify({"message": "Oops, there is a problem. It is not you, we promise !!!"}), 500

    # runs through the blogposts database to get teh post with the unique id
    for count, post in enumerate(blog_posts):
        if post['id'] == post_id:
            del blog_posts[count]
            json_data = json.dumps(blog_posts)

            # Writes the updated bloposts data to the posts.json file database
            with open("posts.json", "w") as fileobj:
                fileobj.write(json_data)
            return jsonify({"message": f"Post with id {post_id} has been deleted successfully."})

    return jsonify({"error": "No post with the provided id"}), 400


@app.route('/api/posts/<int:post_id>', methods=['PUT'])
def update(post_id):
    """
        Runs when there is an update operation post request from client's form, gets the update info and
        updates the database with the new information and returns the updated info to the client
    :param post_id:
    :return:
    """
    new_post = request.get_json()
    new_title = new_post.get('title')
    new_content = new_post.get('content')
    new_date = new_post.get('date')

    try:
        blog_posts = load_data('posts.json')
    except JSONDecodeError:
        return jsonify({"message": "Oops, there is a problem. It is not you, we promise !!!"}), 500
    post = None
    for post_data in blog_posts:
        if post_data['id'] == post_id:
            post = post_data
    if post is None:
        return jsonify({"error": "No post with the provided id"}), 400

    if new_title == '':
        new_title = post.get('title')
    if new_content == '':
        new_content = post.get('content')
    if new_date != f"{datetime.today().date()}":
        new_date = f"{datetime.today().date()}"

    post['title'] = new_title
    post['content'] = new_content
    post['date'] = new_date

    json_data = json.dumps(blog_posts)
    with open("posts.json", "w") as fileobj:
        fileobj.write(json_data)

    return jsonify(post)


@app.route('/api/posts/search')
def search():
    """
        Runs when the client sends a search query and returns posts matching the searched query to client
    :return:
    """
    try:
        blog_posts = load_data('posts.json')
    except JSONDecodeError:
        return jsonify({"message": "Oops, there is a problem. It is not you, we promise !!!"}), 500

    # gets the serach-word sent by client
    search_word = request.args.get('search-word')
    if search_word == '':
        return jsonify(blog_posts)

    # runs through blogposts database to find posts that matches search query
    list_of_posts = []
    for post in blog_posts:
        if search_word in post.get('title'):
            list_of_posts.append(post)
    for post in blog_posts:
        if search_word in post.get('author'):
            list_of_posts.append(post)
    for post in blog_posts:
        if search_word in post.get('content'):
            list_of_posts.append(post)
    for post in blog_posts:
        if search_word in post.get('date'):
            list_of_posts.append(post)
    return jsonify(list_of_posts)


@app.route('/api/posts/like/<int:post_id>')
def like(post_id):
    """
       Increase the like count by 1, updates the blogpost database and return the updated blogposts data to client
    :param post_id:
    :return:
    """
    try:
        blog_posts = load_data('posts.json')
    except JSONDecodeError:
        return jsonify({"message": "Oops, there is a problem. It is not you, we promise !!!"}), 500

    # Iterates over the blogposts to find the post with the matching id
    for post_data in blog_posts:
        if post_data['id'] == post_id:
            likes = post_data['likes'] + 1
            post_data['likes'] = likes

            json_data = json.dumps(blog_posts)
            with open("posts.json", "w") as fileobj:
                fileobj.write(json_data)
            return jsonify(blog_posts)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5002, debug=True)
