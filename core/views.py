from django.shortcuts import render, redirect

def home(request):
    return render(request, 'core/home.html')

def activities(request):
    return render(request, 'core/activities.html')

def tools(request):
    return render(request, 'core/tools.html')

def about(request):
    return render(request, 'core/about.html')

def contact(request):
    sent = False
    if request.method == 'POST':
        # In production, send an email here
        sent = True
    return render(request, 'core/contact.html', {'sent': sent})
