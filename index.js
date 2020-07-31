'use strict';

const axios = require('axios');
const qs = require('querystring');
const url = require('url');

const ENDPOINT = 'https://api.github.com/graphql';
const USERNAME = process.env.USERNAME;
const TOKEN = process.env.TOKEN;

module.exports = async (req, res) => {
  let limit = 2;
  let cursor = null;
  let queryParams = qs.parse(url.parse(req.url).query);

  if (queryParams.cursor) {
    cursor = queryParams.cursor;
  }

  if (queryParams.limit) {
    limit = Number(queryParams.limit);
  }

  let query = `query {
    user(login: "${USERNAME}") {
      repositories(first: ${limit}, isFork: false, orderBy: { field: CREATED_AT, direction: DESC }, after: ${JSON.stringify(cursor)}) {
        totalCount
        edges {
          node {
            name
            description
            url
            stargazers {
              totalCount
            }
            primaryLanguage {
              name
              color
            }
          }
          cursor
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }`;


  let results = await axios({
    url: ENDPOINT,
    method: 'post',
    headers: {
      Authorization: `Bearer ${TOKEN}`
    },
    data: {
      query: query
    }
  });

  res.end(JSON.stringify(results.data));
};
