import React, { Component } from "react";
import DeleteBtn from "../../components/DeleteBtn";
import Jumbotron from "../../components/Jumbotron";
import SearchResults from "../../components/Search";
import API from "../../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../../components/Grid";
import { List, ListItem } from "../../components/List";
import { Input, FormBtn } from "../../components/Form";
import Results from "../../components/Results"


class Books extends Component {
  state = {
    books: [],
    title: "",
    author: "",
    summary: "",
    date:"",
    url:"",
    topic: "",
    startYear: "",
    endYear: "",
    articles: [],
    saved: []
  };

  componentDidMount() {
    this.loadBooks();
  }

  loadBooks = () => {
    API.getBooks()
      .then(res =>
        this.setState({ books: res.data, title: "", author: "", summary: "", date:"", url:"" })
      )
      .catch(err => console.log(err));
  };

  deleteBook = id => {
    API.deleteBook(id)
      .then(res => this.loadBooks(res))
      .catch(err => console.log(err));
  };

    // Method for getting saved articles (all articles) from the db
    getSavedArticles = () => {
      API.getArticle()
        .then((res) => {
          this.setState({ saved: res.data });
        });
    }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  // When save article button is clicked, add article to db
  handleTheSaveButton = (id) => {
    const findArticleByID = this.state.articles.find((el) => el._id === id);
    console.log("You saved this article: ", findArticleByID);
    const newSave = {title: findArticleByID.headline.main, author: findArticleByID.byline.original, summary: findArticleByID.snippet, date:findArticleByID.pub_date, url: findArticleByID.web_url};
    API.saveBook(newSave)
    .then(this.loadBooks())
    .catch(err => console.log(err));
  };

  // handleFormSubmit = event => {
  //   event.preventDefault();
  //   if (this.state.title && this.state.author) {
  //     API.saveBook({
  //       title: this.state.title,
  //       author: this.state.author,
  //       synopsis: this.state.synopsis
  //     })
  //       .then(res => this.loadBooks())
  //       .catch(err => console.log(err));
  //   }
  // };

    // A helper method for rendering one search results div for each article
    renderArticles = () => {
      return this.state.articles.map(article => (
        <Results
          _id={article._id}
          key={article._id}
          title={article.headline.main}
          date={article.pub_date}
          url={article.web_url}
          handleTheSaveButton={this.handleTheSaveButton}
          getSavedArticles={this.getSavedArticles}
        />
      ));
    }

  // Keep track of what user types into topic input so that input can be grabbed later
  handleTopicChange = (event) => {
    this.setState({ topic: event.target.value });
  }

  // Keep track of what user types into topic input so that input can be grabbed later
  handleStartYearChange = (event) => {
    this.setState({ startYear: event.target.value });
  }

  // Keep track of what user types into topic input so that input can be grabbed later
  handleEndYearChange = (event) => {
    this.setState({ endYear: event.target.value });
  }

  // When the search form submits, perform NYT api search with user input
  handleTheFormSubmit = (event) => {
    event.preventDefault();
    console.log("Getting NYT Articles");
    console.log("this.state.topic: ", this.state.topic);
    console.log("this.state.startYear: ", this.state.startYear);
    console.log("this.state.endYear: ", this.state.endYear);
    API.searchNYT(this.state.topic, this.state.startYear, this.state.endYear)
      .then((res) => {
        this.setState({ articles: res.data.response.docs });
        console.log("this.state.articles: ", this.state.articles);
      })
      .catch(err => console.log(err));

  }

   
  

  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="md-6">
            <Jumbotron>
              <h1>Find an Article to Read</h1>
            </Jumbotron>
            <form>
              <Input
                value={this.state.topic}
                onChange={this.handleTopicChange}
                name="title"
                placeholder="Article Name"
              />
              <Input
                value={this.state.startYear}
                onChange={this.handleStartYearChange}
                name="author"
                placeholder="Beginning Year"
              />
              <Input
                value={this.state.endYear}
                onChange={this.handleEndYearChange}
                name="synopsis"
                placeholder="Ending Year"
              />
              <FormBtn
                // disabled={!(this.state.author && this.state.title)}
                onClick={this.handleTheFormSubmit}
              >
                Submit Search
              </FormBtn>
            </form>
          </Col>
          <Col size="md-6 sm-12">
            <Jumbotron>
              <h1>Saved Articles</h1>
            </Jumbotron>
            {this.state.books.length ? (
              <List>
                {this.state.books.map(book => (
                  <ListItem key={book._id}>
                    <Link to={"/books/" + book._id}>
                      <strong>
                        {book.title} by {book.author}
                      </strong>
                    </Link>
                    <DeleteBtn onClick={() => this.deleteBook(book._id)} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <h3>No Results to Display</h3>
            )}
          </Col>
          <Col size="md-6">
            <Jumbotron>
              <h1>Article List</h1>
            </Jumbotron>
            <SearchResults
            renderArticles={this.renderArticles}
          />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Books;
