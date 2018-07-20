// import Bacon from 'baconjs';

function gatewayUI(gateway, $) {
    console.log(gateway);
    const ui = {
	path: $('#path'),
	callbackPath: $('#callbackPath'),
	strategy: $('#strategy'),
	id: $('#clientID'),
	secret: $('#clientSecret')
    };
    $('#makeClient').asEventStream('click').log('click')
	.map(_ => ({
	    path: ui.path.val(),
	    callbackPath: ui.callbackPath.val(),
	    strategy: ui.strategy.val(),
	    id: ui.id.val(),
	    secret: ui.secret.val()
	})).log('fields')
	.flatMap(fields => Bacon.fromPromise(gateway.post(
	    'makeClient',
	    fields.path, fields.callbackPath, fields.strategy,
	    fields.id, fields.secret))
		 .log('makeClient')
		 .zip(Bacon.once(fields), (c, f) => [c, f])).log('flatMap |> zip')
	.onValue(addClient);

    function addClient([it, {path, strategy, id}]) {
        $('#clients').append(
            $('<a />',
              {href: it.webkey,
               text: `${path}: ${strategy}: ${id}`})
                .wrap('<li />').parent());
    }
}
