from django.shortcuts import resolve_url, redirect, render
from django.contrib.auth import logout as auth_logout
from django.views.generic.base import RedirectView
from django.http import HttpResponseRedirect
from django.conf import settings
from django.contrib import messages
from .forms import RegisterForm



def signup(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Account created. Now you can login!!")
            return redirect('user:login-user')
    else:
        form = RegisterForm()
    return render(request, 'user/registration.html', {'form': form})


# Create your views here.

class LogoutView(RedirectView):
    """
    Log out and redirect to login page
    """

    http_method_names = ["get", "options"]

    def get(self, request, *args, **kwargs):
        """Logout may be done via POST."""
        auth_logout(request)
        redirect_to = resolve_url(settings.LOGOUT_REDIRECT_URL)
        messages.success(request, "Logout successfully.")
        return HttpResponseRedirect(redirect_to)