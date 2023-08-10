# Diall-Coop



App Requirements
○ Add a nav bar at the bottom of the screen
■ The current active page should be filled in with white
○ Watch Page
■ This page is a feed of videos, the user can swipe up or down to do a
different video. Only one video should be played at a time.
■ Should scroll smoothly
■ First Video should autoplay
■ Tapping the video should pause the video
● When a video is paused the paused icon should be shown
● Tapping the the video again should play it
■ Clicking the share button should bring up the share menu. Refer to react
native docs for how to implement.
■ When you get to the end of the feed it should restart from the first video
to simulate an infinite feed
    
 ■ At the bottom left you should include a username of the person who made the video and the video’s title.
○ Ask Page
■ There are two ways to reach this page
● By clicking on the ask button on the nav bar
● On the search page, you can ask a specific therapist.
■ This page allows the user to record a video and add it to the feed.
■ Add an info icon in the top right
● Clicking on the info icon should open a pop-up
○ Clicking anywhere on the screen should close the pop-up
■ Clicking on the recording button should start the recording
● Recording can be set to maximum of 15 seconds long
● If the user taps on the button again or 15 seconds are up then the
video should stop recording.
■ Once a video has been recorded
● Show an X button in the top left corner
○ Clicking the x button will delete the recording
● Show an input for the user to enter a title
○ Title can be 40 characters max, adjust input field size
vertically so the full title is shown without overflowing off
the screen.
● Show a send it button
○ User must enter a title before being able to click send button
■ Once a user clicks the send button
● If the user was brought from the search page then save the
username on the video as the therapist they asked the question
else put it as “anonymous”.
● If the user was brought into the page by clicking the ask button on
the nav bar, then the therapist name should be “anonymous”.
● Video should be saved and displayed at the top of the watch page.
● Users should be brought to the watch page.
○ Search Page
■ Add data for 5 potential therapists in the database to populate the search
● Include the following ○ Profile pic
■ Can use any image
○ Username
■ SarahJohnsonLMFT ■ MichaelWilliamsLPC ■ EmilyAndersonPsyD ■ DavidMartinezLMHC ■ LauraThompsonLMFT
○ 3 mental health related keywords

 ■ Sarah Johnson, LMFT:
● Couples Counseling
● Communication Skills
● Family Dynamics
■ Michael Williams, LPC:
● Anxiety Management
● Depression Treatment
● Emotional Regulation
■ Emily Anderson, PsyD:
● Cognitive Behavioral Therapy (CBT)
● Trauma Processing
● Mindfulness Practice
■ David Martinez, LMHC:
● Emotional Regulation
● Self-Esteem Building
● Grief Counseling
■ Laura Thompson, MSW:
● Social Skills Training
● Parenting Support
● Communication Skills
■ The search page can be accessed from the nav bar
● When a user clicks on this page the search bar should auto focus
■ Implement a search feature where a user can search for a therapist using their username or one of the keywords associated with this.
■ When the user clicks done
● If there are any partial or full matches then they should be
displayed in a list.
○ If the user clicks ask then bring them to the ask screen,
and when they submit a video the username should be of
the therapist that they clicked on.
● If there are no matches then display the ‘Don’t see your therapist’’
message. If the user clicks invite your therapist then bring up the share menu
○
● Please reference our current app, your skills, experience, ideas and technology to do the
following:
○ Prioritize the problems identified into a list
■ You are allowed to suggest and implement alternatives – if you do so, please include this in the prioritization with the proposed problems we listed (feel free to include if you would not prioritize others + why)
○ Pick the most immediate problem and code a single feature that solves it (we will review this code together)
■ The intention is that you deliver a single feature from scratch (no modification of our current code and no need to build an entire app)
 
■ Your solution can affect one type of user or both types of users
■ This purposefully doesn’t include a Figma file or sample code, to remove
potential bias
○ Build a short action plan of how you would solve the rest of the problems
■ Make sure to include how you would use 1 product designer, 1 mid level engineer and 1 junior engineer on your team
