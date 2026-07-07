# TODO - Reddit Playwright UI tests

## Auth tests
- [ ] Keep/verify `tests/loginValid.spec.js`
- [ ] Ensure invalid login test coverage (`tests/loginValidation.spec.js` already exists)

## Subreddit/Post flows
- [ ] Implement POMs:
  - [ ] `page/subredditSearchPage.po.js`
  - [ ] `page/subredditPage.po.js`
  - [ ] `page/postPage.po.js`
  - [ ] `page/accountMenuPage.po.js` (menu + logout)
  - [ ] `page/forgotPasswordPage.po.js`
- [ ] Implement specs:
  - [ ] `tests/searchSubreddit.spec.js`
  - [ ] `tests/openSubreddit.spec.js`
  - [ ] `tests/searchPost.spec.js`
  - [ ] `tests/voteUpDown.spec.js` (valid login)
  - [ ] `tests/commentValidation.spec.js` (valid login)
  - [ ] `tests/logout.spec.js` (valid login)

## Create post (optional)
- [ ] If supported/stable, add `tests/createPost.spec.js` (valid login)

## Navigation menu testing (create all these test)
- [ ] Implement `tests/navigationMenu.spec.js`
- [ ] Validate each relevant menu item loads expected destination

## Forgot password UI
- [ ] Implement `tests/forgotPasswordUI.spec.js`

## QA / CI
- [ ] Run `npx playwright test`
- [ ] Fix selectors and flakiness based on `playwright-report/`

