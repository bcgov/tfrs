//
//
// Copyright © 2019 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Jason Leach on 2019-03-26.
//

/* eslint-disable camelcase, class-methods-use-this */

const labelsAsString = labels => labels.map(label => label.name).join(', ');

const githubEventHandlers = {
  //
  // Pull Request Trigger
  //

  pull_request(request) {
    let message;
    if (
      request.content.action === 'opened' ||
      request.content.action === 'reopened' ||
      request.content.action === 'edited' ||
      request.content.action === 'synchronize'
    ) {
      message = request.content.pull_request.body;
    } else if (request.content.action === 'assigned' || request.content.action === 'unassigned') {
      message = `Current assignee: ${request.content.pull_request.assignee.login}`;
    } else if (request.content.action === 'labeled') {
      message = `Current labels: ${labelsAsString(request.content.pull_request.labels)}`;
    } else if (request.content.action === 'closed') {
      if (request.content.pull_request.merged) {
        message = `Merged by: ${request.content.pull_request.merged_by.login}`;
      } else {
        message = 'Closed';
      }
    } else {
      return {
        error: {
          success: false,
          message: 'This PR action is not supported.',
        },
      };
    }

    return {
      content: {
        username: 'GitHub',
        icon_url: 'https://octodex.github.com/images/mona-lovelace.jpg',
        text: `Pull request #${request.content.pull_request.number} *${
          request.content.action
        }* by ${request.content.sender.login}.`,
        color: '#764FA5',
        attachments: [
          {
            title: request.content.pull_request.title,
            title_link: request.content.pull_request.html_url,
            text: message,
            color: '#764FA5',
          },
        ],
      },
    };
  },
};

// eslint-disable-next-line no-unused-vars
class Script {
  process_incoming_request({ request }) {
    const header = request.headers['x-github-event'];
    if (githubEventHandlers[header]) {
      return githubEventHandlers[header](request);
    }

    return {
      error: {
        success: false,
        message: 'This method is not supported.',
      },
    };
  }
}
