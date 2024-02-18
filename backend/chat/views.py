 
from django.shortcuts import render, redirect, resolve_url
from django.contrib.auth import logout as auth_logout
from django.views.generic.base import RedirectView
from django.http import HttpResponseRedirect
from django.conf import settings
 
 
def chatPage(request, *args, **kwargs):
    if not request.user.is_authenticated:
        return redirect("chat:login-user")
    context = {}
    return render(request, "chat/chat-page.html", context)


class LogoutView(RedirectView):
    """
    Log out and redirect to login page
    """

    http_method_names = ["get", "options"]

    def get(self, request, *args, **kwargs):
        """Logout may be done via POST."""
        auth_logout(request)
        redirect_to = resolve_url(settings.LOGOUT_REDIRECT_URL)
        return HttpResponseRedirect(redirect_to)
