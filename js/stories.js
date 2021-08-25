"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage(storyList);
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, type = null) {
  // console.debug("generateStoryMarkup", story);

  const hostName = "hostname.com";
  let favorited = "r"
  try {
    favorited = User.favorites.find((i) => i.storyId == story.storyId) != undefined
  ? "s" : "r"
  } catch (err) { console.log("failed", err)}
  
  if (type) {
    return $(`
    <li id="${story.storyId}">
      <span class="trash-can"> <i class="fas fa-trash-alt"></i></span>
      <span class="star"> <i class="fa${favorited} fa-star"></i></span>
      <a href="${story.url}" target="a_blank" class="story-link">
        ${story.title}
      </a>
      <small class="story-hostname">(${hostName})</small>
      <small class="story-author">by ${story.author}</small>
      <small class="story-user">posted by ${story.username}</small>
    </li>
  `);
  }
  return $(`
      <li id="${story.storyId}">
        <span class="star"> <i class="fa${favorited} fa-star"></i></span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage(stories, type = null) {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of stories.stories) {
    const $story = generateStoryMarkup(story, type);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function toggleFavStory(user, storyID) {
  const token = user.loginToken;
  let toggle = "POST";

  if (User.favorites != undefined) {
    toggle =
      User.favorites.find((i) => i.storyId == storyID) != undefined
        ? "DELETE"
        : "POST";
  }

  console.log(storyID);
  console.log(toggle);

  const response = await axios({
    url: `${BASE_URL}/users/${user.username}/favorites/${storyID}`,
    method: `${toggle}`,
    data: { token },
  });
  User.favorites = response.data.user.favorites;
}

$allStoriesList.on("click", ".star", (e) => {
  const id = $(e.target).parent().parent().attr("id");
  if ($(e.target).hasClass('far')) {
    $(e.target).addClass('fas')
    $(e.target).removeClass('far')
  } else {
    $(e.target).addClass('far')
    $(e.target).removeClass('fas')
  }
  toggleFavStory(currentUser, id);
});

$allStoriesList.on("click", ".trash-can", async (e) => {
  const id = $(e.target).parent().parent().attr("id");
  await StoryList.removeStory(id)
  $(e.target).parent().parent().remove()
});