// Funzione per creare il modale dinamico
let callback;

function createModal() {
    const modalHTML = `
        <div class="modal fade" id="dynamicModal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalLabel">Modifica Dati</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="dynamicEditForm">
                            <!-- I campi verranno aggiunti dinamicamente qui -->
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Annulla</button>
                        <button type="button" class="btn btn-primary" onclick="saveModalData()">Salva</button>
                    </div>
                </div>
            </div>
        </div>`;

    if (!$('#dynamicModal').length) {
        $('body').append(modalHTML);
    }
}

// Funzione per aprire il modale con campi dinamici, inclusi i campi combobox con ID, Label e Opzione Predefinita
function openModal(data, Fcallback) {
    createModal(); // Crea il modale se non esiste già
    callback = Fcallback; // Imposta la callback
    const form = $('#dynamicEditForm');
    form.empty(); // Pulisce eventuali campi esistenti

    $.each(data, function (key, value) {
        const formGroup = $('<div class="form-group"></div>');
        const label = $(`<label for="modal-${key}">${key.charAt(0).toUpperCase() + key.slice(1)}</label>`);

        let input;
        if (Array.isArray(value) && typeof value[0] === 'object' && 'id' in value[0] && 'label' in value[0]) {
            // Se il valore è un array di oggetti con proprietà id, label, e opzionalmente selected, crea una combobox
            input = $('<select class="form-control"></select>').attr('id', `modal-${key}`).attr('name', key);
            value.forEach(option => {
                const optionElement = $('<option></option>')
                    .attr('value', option.id)
                    .text(option.label);
                if (option.selected) {
                    optionElement.attr('selected', 'selected'); // Imposta l'opzione predefinita
                }
                input.append(optionElement);
            });
        } else {
            // Altrimenti crea un input di testo o numerico
            if (key != "id") {
                input = $('<input>').attr('type', typeof value === 'number' ? 'number' : 'text')
                    .attr('class', 'form-control')
                    .attr('id', `modal-${key}`)
                    .attr('name', key)
                    .val(value);
            } else {
                input = $('<input>').attr('type', typeof value === 'number' ? 'number' : 'text')
                    .attr('class', 'form-control')
                    .attr('id', `modal-${key}`)
                    .attr('name', key)
                    .val(value)
                    .attr('readonly', true);
            }
        }

        formGroup.append(label).append(input);
        form.append(formGroup);
    });

    // Mostra il modale
    $('#dynamicModal').modal('show');
}

// Funzione per salvare i dati dal modale
function saveModalData() {
    const formData = {};
    $('#dynamicEditForm')
        .serializeArray()
        .forEach(field => {
            formData[field.name] = isNaN(field.value) ? field.value : Number(field.value);
        });

    console.log("Dati aggiornati:", formData);

    // Nasconde il modale
    $('#dynamicModal').modal('hide');

    // Se la callback è una funzione, la chiama con i dati
    if (typeof callback === 'function') {
        callback(formData);
    } else {
        // Se la callback non è stata passata, stampa i dati nella console
        console.log("Callback non passata. Dati:", formData);
    }
}
