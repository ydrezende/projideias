function getCookieValue(a) {
    var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
}

$("#filterForm").on("submit", function(e) {
    e.preventDefault();

    var data = $("#filterForm").serialize();
                
    $.get("api/GetIdeas", data, function(projects) {
        projects = JSON.parse(projects);
            tbody.children().remove();

        for(i in projects) {
            var projectRow = '<tr>'+
                '<td>'+ projects[i].title +'</td>'+
                '<td>'+ projects[i].name +'</td>'+
                '<td>'+ projects[i].description +'</td>'+
            '</tr>';

            tbody.append(projectRow);
        }
    }).fail(function(status) {
        if(status.status == "404") tbody.children().remove();
    });
});

$("#registerForm").on("submit", function(e) {
    e.preventDefault();

    var form = $(this);
    var emailInputObj = $("#email");
    var passwordInputObj = $("#password");
    var rePasswordInputObj = $("#repeated-password");

    if(passwordInputObj.val() == rePasswordInputObj.val()) {
        $.get("api/UserExists", form.serialize() ).fail(function(status) {
            if(status.status == "404") {                    
                form.children("button").remove();
                form.append(fullForm);
                form.find("#phone").parent().before(emailInputObj.parent());
                form.find("button").before(document.createElement('div'));
                form.off("submit").on("submit", function (e) {
                    if(passwordInputObj.val() == rePasswordInputObj.val()) {
                        rePasswordInputObj.parent().remove();
                        data = form.serialize();
                        e.preventDefault();
                        $.post("api/CreateUser", data, function() {
                            $("h1").html('<h1>Pronto!</h1>');
                            form.before('<h3>Você pode entrar agora</h3>');
                            form.before('<a class="button button-primary" href="login">Entrar</a>');
                            form.remove();
                        }).fail(function(status) {
                            alert("Failure\nStatus: " + status.status);
                        });
                    }
                });
                form.find('div').last().addClass("row").append(($(":password").parent()));
                form.find(".row").slice(0,3).remove();
            }
        });
    }
});

$("#loginForm").on("submit", function(e) {
    e.preventDefault();

    var form = $(this);
    var emailInputObj = $("#email");
    var passwordInputObj = $("#password");

    var data = {
        email : emailInputObj.val(),
        password : passwordInputObj.val()
    };

    $.post("api/Auth/CheckEmail", data, function(content, status) {
        console.log('Content: '+ content);
        console.log('Status: '+ status);
        var pwPanel = '<div id="passwordPanel">'+
            '<label for="password">Senha</label>'+
            '<input id="password" id="password" type="password">'+
            '<div>'+
            '<button class="button-primary">Entrar</button>'+
            '</div>'+
            '</div>';
        form.append(pwPanel);
        form.children("#emailPanel").remove();
        form.off("submit").on("submit", function(e) {
            var emailToken = getCookieValue('emailToken');
            var pw = $("#password").val();
            e.preventDefault();
            $.post("api/Auth/Login", { emailToken : emailToken, password : pw }, function(content, status) {
                console.log('Content: '+ content);
                console.log('Status: '+ status);
                alert("Logado com token: " + content.token);
            });
        });
        document.cookie = "emailToken="+ content.emailToken;
    });
});

$("#createIdea").on("submit", function (e) {
	e.preventDefault();

	var data = $("#createIdea").serialize();
	$.get("api/CreateIdea", data, function(response) {
		window.location.href = "createidea_success";
	}).fail(function(status) {
		alert(status.responseText);
		$("#title").focus();
	});
});

$("#projectFilterForm").on("submit", function(e) {
	e.preventDefault();

	var data = $("#projectFilterForm").serialize();
				
	$.get("api/GetProjects", data, function(projects) {
		projects = JSON.parse(projects);
		tbody.children().remove();

		for(i in projects) {
			var projectRow = '<tr>'+
				'<td>'+ projects[i].name +'</td>'+
				'<td>'+ projects[i].type +'</td>'+
				'<td>'+ projects[i].status +'</td>'+
				'<td>'+ projects[i].creator +'</td>'+
				'<td>'+ projects[i].description +'</td>'+
			'</tr>';

			tbody.append(projectRow);
		}
	}).fail(function(status) {
		if(status.status == "404") tbody.children().remove();
	});
});