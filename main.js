let SELECTED_CELLS = []
        let ACTIVE_CELL = null
        let EDIT_MODE = false
        let DONT_EDIT = ['id', 'zip']
        const tbody = document.querySelector('.tbody')
        const thead = document.querySelector('.thead')
        let input = document.getElementById('input')
        let row_info = document.querySelector('.row_info')
        let column_info = document.querySelector('.column_info')
        let column_name_info = document.querySelector('.column_name_info')
        let sub_menu = document.querySelector('.sub_menu')
        let main_menu = document.querySelector('.main_menu')
        let main_menu_items = document.querySelector('.main_menu_items')
        let add_row = document.querySelector('.add_row')

        window.document.body.addEventListener('keyup', key_pressed)
        window.document.body.addEventListener('click', () => {
            sub_menu.style.display = 'none'
        })

        window.addEventListener('selectionStart', () => alert())

        main_menu.addEventListener('click', () => {
            main_menu_items.style.display = 'block'
        })


        getData('api.php', {
            data_type: 'read'
        })


        tbody.addEventListener('click', click_select)
        tbody.addEventListener('contextmenu', show_sub_menu)

        function show_sub_menu(e) {
            e.preventDefault()
            select_by_mouse(e)
            sub_menu.style.left = e.clientX + 'px'
            sub_menu.style.top = e.clientY + 'px'
            sub_menu.style.display = 'block'
            return false
        }

        function getData(url, data) {
            const xhr = new XMLHttpRequest()
            xhr.open('POST', url)
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    handle_result(xhr.responseText)
                }
            }
            xhr.send(JSON.stringify(data))
        }



        function handle_result(result) {
            // console.log(result);
            if (result == '') return
            const OBJ = JSON.parse(result)
            if (OBJ.data_type == 'read') {
                refresh_table(OBJ.data)
            } else if (OBJ.data_type == 'save') {
                getData('api.php', {
                    data_type: 'read'
                })

                alert('data saved successfully...')
            }

        }





        function refresh_table(data) {
            const thead = document.querySelector('.thead')
            tbody.innerHTML = ''
            thead.innerHTML = ''
            let output = ''
            let head = '<tr>'

            for (let key in data[0]) {
                head += `
                <th> ${key} </th>
            `
            }
            head += "</tr>"


            thead.innerHTML = head

            for (let i = 0; i < data.length; i++) {
                output += '<tr>'
                let number = 0
                for (let key in data[i]) {
                    output += `
                <td row = "${i}" column = "${number}" columnName = "${key}">${data[i][key]}</td>
                `
                    number++
                }
                output += '</tr>'

            }
            tbody.innerHTML = output


        }
        /**** 
        Make sure you add these features in the future

        i need to add more rows to the data

        *****/
        // add_row.addEventListener('click', () => {

        //     let output = "<tr>"
        //     for (let i = 0; i < 6; i++) {

        //         output += "<td> </td>"
        //     }

        //     output += "</tr>"

        //     tbody.innerHTML += output;
        // })

        // function check_column() {
        //     let tbody = document.querySelector('.tbody')
        //     let num = tbody.children[0].children.length
        //     return num

        // }



        function edit(e) {
            input.value = SELECTED_CELLS[0].innerHTML
            ACTIVE_CELL = SELECTED_CELLS[0]

            let column = SELECTED_CELLS[0].getAttribute('columnName')
            if (DONT_EDIT.indexOf(column) == -1) {
                ACTIVE_CELL.innerHTML = ''
                SELECTED_CELLS[0].insertBefore(input, null)
                input.style.display = ''
                input.focus()
                EDIT_MODE = true
            }

            sub_menu.style.display = 'none'

        }

        function update_cell(e) {
            EDIT_MODE = false
            let input_holder = document.getElementById('input_holder')
            let input = document.getElementById('input')
            input.style.display = 'none'
            input_holder.insertBefore(e.target, null)
            ACTIVE_CELL.innerHTML = e.target.value
        }


        function key_pressed(e) {
            if (e.key == 'Enter') {
                if (EDIT_MODE) {
                    update_cell(e)
                }

            } else if (e.key == 'ArrowUp') {
                select_by_keyboard('up')
            } else if (e.key == 'ArrowRight') {
                select_by_keyboard('right')
            } else if (e.key == 'ArrowDown') {
                select_by_keyboard('down')
            } else if (e.key == 'ArrowLeft') {
                select_by_keyboard('left')
            } else if (e.key == 'Delete') {
                delete_content()
            } else if (e.key == 'Escape') {
                for (let i = 0; i < SELECTED_CELLS.length; i++) {
                    SELECTED_CELLS[i].classList.remove('selected')
                }
                main_menu_items.style.display = 'none'
                sub_menu.style.display = 'none'
            }

        }

        function delete_content() {
            for (let i = 0; i < SELECTED_CELLS.length; i++) {
                let column = SELECTED_CELLS[i].getAttribute('columnName')
                if (DONT_EDIT.indexOf(column) == -1) {
                    SELECTED_CELLS[i].innerHTML = ''
                }
            }
            sub_menu.style.display = 'none'
        }

        function click_select(e) {
            select_by_mouse(e)
            sub_menu.style.display = 'none'
            main_menu_items.style.display = 'none'
        }

        function select_by_mouse(e) {
            for (let i = 0; i < tbody.children.length; i++) {
                let tr = tbody.children[i]
                for (let j = 0; j < tr.children.length; j++) {
                    tr.children[j].classList.remove('selected')
                }
            }
            e.target.classList.add('selected')
            SELECTED_CELLS = []
            SELECTED_CELLS.push(e.target)
            update_cell_info()
        }


        function select_by_keyboard(mode) {
            if (SELECTED_CELLS.length == 0) {
                return
            }
            let to_select = cell_to_select(SELECTED_CELLS[0], mode)
            let new_cell = null
            for (let i = 0; i < tbody.children.length; i++) {
                let tr = tbody.children[i]
                for (let j = 0; j < tr.children.length; j++) {
                    let row = tr.children[j].getAttribute('row')
                    let column = tr.children[j].getAttribute('column')
                    if (to_select.row == row && to_select.column == column) {
                        new_cell = tr.children[j]
                        new_cell.classList.add('selected')
                    } else {
                        tr.children[j].classList.remove('selected')
                    }
                }
            }
            if (new_cell) {
                SELECTED_CELLS = []
                SELECTED_CELLS.push(new_cell)
                update_cell_info()
            }


        }


        function cell_to_select(selected_cell, mode) {

            let to_select = {
                row: 0,
                column: 0
            }
            let row = selected_cell.getAttribute('row')
            let column = selected_cell.getAttribute('column')
            if (mode == 'up') {
                to_select.row = (+row > 0) ? (+row - 1) : 0
                to_select.column = +column
            } else if (mode == 'right') {
                to_select.row = +row
                to_select.column = +column + 1
            } else if (mode == 'down') {
                to_select.row = +row + 1
                to_select.column = +column
            } else if (mode == 'left') {
                to_select.row = +row
                to_select.column = (+column > 0) ? (+column - 1) : 0
            }

            return to_select

        }


        function update_cell_info() {
            if (SELECTED_CELLS.length == 0) return
            row_info.innerHTML = SELECTED_CELLS[0].getAttribute('row')
            column_info.innerHTML = SELECTED_CELLS[0].getAttribute('column')
            column_name_info.innerHTML = SELECTED_CELLS[0].getAttribute('columnName')
        }


        function collect_data() {
            if (!confirm('Are you sure, you want to save')) {
                return
            }
            let tbody = document.querySelector('tbody')
            let data = []
            let object = {}
            for (let i = 0; i < tbody.children.length; i++) {
                object = {}

                for (let j = 0; j < tbody.children[i].children.length; j++) {
                    let column = tbody.children[i].children[j].getAttribute('columnname')
                    object[column] = tbody.children[i].children[j].innerHTML
                }
                data.push(object)

            }
            let main_obj = {
                data_type: 'save',
                data: data
            }
            getData('api.php', main_obj)

        }