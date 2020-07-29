Thank you for your interest to contribute to the University Course on Hyperledger Fabric! 🎉🎉

The contributing guide is greatly based on [Hyperledger Cactus project](https://github.com/hyperledger/cactus/blob/master/CONTRIBUTING.md). 
Thanks for Hyperledger Cactus maintainers and contributors. You rock!

Quoting some parts of that document: 

## Git Know How / Reading List

This section is for you if you do not know your way around advanced git concepts such as
- rebasing (interactive or otherwise)
- splitting commits/PRs
- when to use and not to use force push

A word on the controversial topic of force pushes:
In many git guides you will read that force push is basically forbidden.
This is true 99% of the time, BUT if you are the only person working on a branch (which is most of time true for a feature/fix branch of yours that you are planning to submit as a PR) then force pushing is not just allowed but necessary to avoid messy git commit logs.
The question you need to ask yourself before force pushing is this: Am I going to destroy someone else's work on the remote branch? If nobody else is working on the branch then the answer is of course no and force push can be used safely. If others are working with you on the branch on the other hand, it is considered polite to ask and warn them in advance prior to force pushing so that they can take the necessary precautions on their side as well.

A handy tool to avoid destroying other's work accidentally is the new(ish) git feature called `--force-with-lease`:
Using `git push --force-with-lease` instead of vanilla `--force` is highly recommended: https://softwareengineering.stackexchange.com/a/312710

> Pull requests are the primary mechanism we use to change Rust. GitHub itself has some great documentation on using the Pull Request feature. We use the "fork and pull" model described here, where contributors push changes to their personal fork and create pull requests to bring those changes into the source repository.
>
> Please make pull requests against the master branch.
>
> Rust follows a no merge policy, meaning, when you encounter merge conflicts you are expected to always rebase instead of merge. E.g. always use rebase when bringing the latest changes from the master branch to your feature branch. Also, please make sure that fixup commits are squashed into other related commits with meaningful commit messages.
>
> GitHub allows closing issues using keywords. This feature should be used to keep the issue tracker tidy.

Source: https://github.com/rust-lang/rust/blob/master/CONTRIBUTING.md#pull-requests

Further reading:
- https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-collaborative-development-models
- https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests


## PR Checklist - Contributor/Developer

1. Fork [university-course](https://github.com/hyperledger-labs/university-course) via Github UI
   - If you are using the Git client on the Windows operating system, you will need to enable long paths for git
     which you can do in PowerShell by executing the command below.
     To clarify, this may also apply if you are using any Git GUI application on Windows such as `Github Desktop` or others.

     ```shell
     git config --global core.longpaths true
     ```

2. Clone the fork to your local machine
3. (Optional) [Create local branch](#create-local-branch) for minimizing code conflicts when you want to contribute multiple changes regarding different issues in parallel.
4. Complete the desired changes 
5. Make sure you have set up your git signatures
   1. Note: Always sign your commits using the `git commit -S`
   2. For more information see [here](https://gist.github.com/tkuhrt/10211ae0a26a91a8c030d00344f7d11b)
6. Think about/decide on what your commit message will be.
7. Commit your changes. Make sure your commit message follows the formatting requirements (details above) and here: [Conventional Commits syntax](https://www.conventionalcommits.org/en/v1.0.0-beta.4/#specification); this aids in release notes generation which we intend to automate
8. Ensure your branch is rebased onto the `upstream` master branch where `upstream` is fancy git talk for the main repo on Github (the one you created your fork from).
   1. If you are having trouble, there are many great resources out there (so we will not write another here).
      1. If you are having trouble locating a suitable guide specifically on the mechanics of rebasing, we can recommend [this one](https://thoughtbot.com/blog/git-interactive-rebase-squash-amend-rewriting-history). Thanks to Rafael for the link!
   2. If merge conflicts arise, you must fix these at rebase time since omitting this step does not magically make the conflicts go away, just pushes it over the fence to the maintainer who will attempt to merge your pull request at a later point in time.
   3. If the above happens, at that point said maintainer will most likely ask you (if not already) to perform the rebase anyway since as the author of a change you are best positioned to resolve any conflicts on the code level. Occassionally maintainers may do the merge/conflict resolution themselves, but do not count on this nor try to make a habit out of relying on the potential kindness.
   4. After successful rebasing, take another look at your commit(s). Ideally there should be just one in each pull request, but also on the other hand each commit should be as small, simple and self contained as possible, so there can be cases where it makes sense to submit a PR with multiple commits if for example you also had to change something in the test tooling while implementing a feature (in which case there could be a commit for the feature itself and another for the necessary changes to the test tooling package). What we respectfully ask though is that you try to avoid these situations and submit most of your PRs with a single, self contained commit that does not touch multiple things. This significantly reduces the cognitive load required to review the changes which in turn makes everyone happier: the maintainers will have an easier job reviewing, which means they'll be doing it faster which will (probably) cause you joy in turn.
9.  Push your changes to your master (or whatever you named your feature branch, that is entirely up to you at the end of the day)
10. Initiate a pull request from your fork to the base repository
   5. Remember: Opening a pull request is like saying "Hey maintainers, I have this change finalized and ready for you to spend time on reviewing it." The word `finalized` here is understood to imply that you are not planning on doing any more changes on the branch apart from when being asked to by the reviewers.
   6. It is perfectly acceptable to open a pull request and mark it as `draft` (a GitHub feature) which then signals to the maintainers that if they have time, they are welcome to look at the change, but it may or may not be in its final form yet so you are not responsible for potential loss of time on their end if the review has to be performed multiple times on account of changes. Once you promote your draft PR to a real one, the comments from the point above apply however.
   7. If your pull request contains a significant change, we recommend that you apply the similarly named github label on in it as well. It is okay if you do not do this, if we detect that the change is indeed significant, we will apply the label. If you do it in advance however, it will probably speed up the proceedings by removing one communication roundtrip from the review process of your pull request.
11. Await CI, DCO & linting quality checks, as well as any feedback from reviewers
12. If you need to update your pull request either because you discovered an issue or because you were asked to do so we ask that you:
   8.  try to add the change in a way that does not produce additional commits on the PR but instead do an `git commit --amend --signoff` on your local branch and then a force push to the remote branch of yours (the PR essentially). Again, if the change you are doing does not fit within any one of the existing commits of your PR, then it is justified to add a new commit and this is up to your discretion (maintainers may respectfully ask you to squash if they see otherwise)

## In practice:
### Create local branch

> Whenever you begin work on a new feature or bugfix, it's important that you create a new branch.

1. Clone your fork to your local machine
2. Setup your local fork to keep up-to-date (optional)
   ```
   # Add 'upstream' repo to list of remotes
   git remote add upstream https://github.com/hyperledger-labs/university-course.git

   # Verify the new remote named 'upstream'
   git remote -v

   # Checkout your master branch and rebase to upstream.
   # Run those commands whenever you want to synchronize with master branch
   git fetch upstream
   git checkout master
   git rebase upstream/master
   ```
3. Create your branch.
   ```
   # Checkout the master branch - you want your new branch to come from master
   git checkout master

   # Create a new branch named `<newfeature>` (give simple informative name)
   git branch <newfeature>
   ```
4. Checkout your branch and add/modify files.
   ```
   git checkout <newfeature>
   git rebase master
   # Happy coding !
   ```
5. Commit changes to your branch.
   ```
   # Commit and push your changes to your fork
   git add -A
   git commit -s -m "<type>[optional scope]: <description>"
   git push origin <newfeature>
   ```
6. Once you've committed and pushed all of your changes to GitHub, go to the page for your fork on GitHub, select your development branch, and click the pull request button.
7. Repeat step 3 to 6 when you need to prepare posting new pull request.

NOTE: Once you submitted pull request, step 6 is not necessary when you made further changes with `git commit --amend` since your amends will be sent automatically.

NOTE: You can refer original tutorial ['GitHub Standard Fork & Pull Request Workflow'](https://gist.github.com/Chaser324/ce0505fbed06b947d962)
