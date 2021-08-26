"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

async function navAllStories(evt) {
  console.debug("navAllStories", evt);
  storyList = await StoryList.getStories();
  hidePageComponents();
  putStoriesOnPage(storyList);
  

}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $("#create-story").show();
  $('#show-favorites').show();
  $('#show-own-stories').show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Shows create story form */

function navCreateStory(evt) {
  console.debug("navCreateStory", evt)
  $navCreateStory.show()
}

$("#create-story").on('click', navCreateStory)

/**Shows favorite story section */
$("#show-favorites").on("click", async () => {
  hidePageComponents();
  const rawData = await User.getUpdatedUser(currentUser)
  const favorites = rawData.data.user.favorites
  putStoriesOnPage(new StoryList(favorites))
});

$('#show-own-stories').on("click", async () => {
  hidePageComponents();
  const rawData = await User.getUpdatedUser(currentUser)
  const ownStories = rawData.data.user.stories
  putStoriesOnPage(new StoryList(ownStories), "Personal")
})