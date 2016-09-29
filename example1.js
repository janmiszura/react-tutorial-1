var Comment = React.createClass({
  rawMarkup: function() {
    var md = new Remarkable();
    var rawMarkup = md.render(this.props.children.toString());
    return { __html: rawMarkup };
  },
  excluir: function(e) {
    //alert('chamou excluir, id: '+this.props.id);
    this.props.onCommentDelete({id: this.props.id});
  },
  render: function() {
    var md = new Remarkable();
    return (
      <div className="comment">
        <h3 className="commentAuthor">
          {this.props.author}
        </h3>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
        <a href="javascript:;" onClick={this.excluir}>(excluir)</a>
      </div>
    );
  }
});

var CommentList = React.createClass({
  handleCommentDelete: function(comment) {
    //alert('hanleCommentDelete, id: '+comment.id);
    this.props.onCommentDelete(comment);
  },
  render: function() {
    var self = this;
    var commentNodes = this.props.data.map(function(comment) {
      return (
        <Comment
          author={comment.author}
          key={comment.id}
          id={comment.id}
          onCommentDelete={self.handleCommentDelete}
        >
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  getInitialState: function() {
    return {author: '', text: ''};
  },
  handleAuthorChange: function(e) {
    this.setState({author: e.target.value});
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    this.setState({author: '', text: ''});
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={this.state.author}
          onChange={this.handleAuthorChange}
        />
        <input
          type="text"
          placeholder="Say something..."
          value={this.state.text}
          onChange={this.handleTextChange}
        />
        <input type="submit" value="Post" />
      </form>
    );
  }
});



var CommentBox = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    comment.id = Date.now();
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
  },
  handleCommentDelete: function(comment) {
    //alert('CommentBox.handleCommentDelete: id: '+comment.id);
    var comments = this.state.data;
    var index = undefined;
    for(var i=0;i<comments.length;i++) {
      if( comments[i].id == comment.id ) {
        index = i;
      }
    }
    comments.splice(index, 1);
    this.setState({data: comments});
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} onCommentDelete={this.handleCommentDelete} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

var data = [
  {id: 1, author: "Pete Hunt", text: "This is one comment"},
  {id: 2, author: "Jordan Walke", text: "This is *another* comment"},
  {id: 3, author: "Fulano de tal", text: "Meu comentário"}
];

ReactDOM.render(
  <CommentBox data={data} />,
  document.getElementById('content')
);
