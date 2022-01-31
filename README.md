Build a page that looks as follow:
- A number in a text field
- Two buttons + and - on the left and right of the text field
When the user presses the + button, the number increase. When the user presses the - button, the number decreases.
Using the history API, when the user clicks the back button in the browser, I would expect the number to decrease or increase depending on what was the last +/- button the clicked
For example
The user open the page. I expect to see the number 0
The user clicks on +, I expect to see the number 1
The user clicks on back button, I expect to see the number 0 again
