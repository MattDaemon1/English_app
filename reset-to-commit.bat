@echo off
echo Retour au commit 010da985fa97c24d29c8af57231e93864cf6ca04
cd /d "c:\Users\mattm\Projects\English_app"
echo.
echo Commit actuel:
git log --oneline -1
echo.
echo Execution du reset...
git reset --hard 010da985fa97c24d29c8af57231e93864cf6ca04
echo.
echo Nouveau commit:
git log --oneline -1
echo.
echo Status:
git status
echo.
echo Operation terminee!
pause
