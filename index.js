'use strict';

const got = require('got');
const qs = require('querystring');

const ENDPOINT = 'https://api.github.com/graphql';
const USERNAME = process.env.USERNAME;
const TOKEN = process.env.TOKEN;

module.exports = async (req, res) => {
  let limit = 2;
  let cursor = null;
  let queryParams = qs.parse(req.url);

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

  let results = await got.post(ENDPOINT, {
    json: true,
    body: { query },
    headers: {
      Authorization: `Bearer ${TOKEN}`
    }
  });

  res.end(JSON.stringify(results.body));
};
