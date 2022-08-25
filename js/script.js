const dataPegawai = []
const RENDER_DATA = 'render-data'
const STORAGEKEY = 'data-pegawai'

saveLocalStorage = () => {      // Untuk MengesaveData ke LocalStorage
    if (localStorage != undefined) {
        const parsed = JSON.stringify(dataPegawai)
        localStorage.setItem(STORAGEKEY, parsed)
        document.dispatchEvent(new Event(RENDER_DATA))
    } else {
        alert('brosur ini tidak bisa menyimpan data ganti brosur lain')
    }
}

loadData = () => {              // unutk meLoad Data
    const serializeData = localStorage.getItem(STORAGEKEY)
    let data = JSON.parse(serializeData)

    if (data != null) {
        for (const e of data) {
            dataPegawai.push(e)
            document.dispatchEvent(new Event(RENDER_DATA))
        } 
    }
}

no = () => {                    //Untuk Mengambil Nomor index array
    let nomor =dataPegawai.length
    return ++nomor
}

menampungData = (no,nama,jenisPekerjaan,lokasi,gajiPerhari,absen,gajian) => {   //Untuk Menampung Data
    return {
        no,
        nama,
        jenisPekerjaan,
        lokasi,
        gajiPerhari,
        absen,
        gajian
    }
}

tambahData = () => {        // Untuk Menambah Data
    const nama = document.getElementById('nama').value
    const pekerjaan = document.getElementById('pekerjaan').value
    const lokasi = document.getElementById('lokasi').value
    const gaji = document.getElementById('gaji').value
    const nomor = no()
    const data = menampungData(nomor, nama, pekerjaan, lokasi, gaji,0,0)
    dataPegawai.push(data)

    document.dispatchEvent(new Event(RENDER_DATA))
    saveLocalStorage()


}

menampilkanDataPegawai = (dataPegawai) => {     //Menampilkan Data
    const tr = document.createElement('tr')

    const tdNomor = document.createElement('td')
    tdNomor.innerText=dataPegawai.no

    const tdNama = document.createElement('td')
    tdNama.innerText = dataPegawai.nama

    const tdLokasi = document.createElement('td')
    tdLokasi.innerText = dataPegawai.lokasi

    const tdJenisPekerjaan = document.createElement('td')
    tdJenisPekerjaan.innerText = dataPegawai.jenisPekerjaan

    const tdGajiPerhari = document.createElement('td')
    tdGajiPerhari.innerText = dataPegawai.gajiPerhari

    const masuk = document.createElement('td')

    const btnMasuk = document.createElement('button')
    btnMasuk.setAttribute('type', 'submit')
    btnMasuk.setAttribute('class',`${dataPegawai.no}`)
    btnMasuk.innerText = 'Masuk'
    btnMasuk.addEventListener('click', () => {
        hitungGaji(dataPegawai.no)
    })
    masuk.append(btnMasuk)


    const hapus = document.createElement('td')
    const btnHapus = document.createElement('button')
    btnHapus.setAttribute('type', 'submit')
    btnHapus.innerText = 'Hapus'
    btnHapus.addEventListener('click', () => {
        hapusDataPegawai(dataPegawai.no)
    })
    hapus.append(btnHapus)


    const edit = document.createElement('td')
    const btnEdit = document.createElement('button')
    btnEdit.setAttribute('type', 'submit')
    btnEdit.innerText = 'Edit'
    btnEdit.addEventListener('click', () => {
        editData(dataPegawai.no)
    })
    edit.append(btnEdit)

    
    tr.append(
        tdNomor,
        tdNama,
        tdLokasi,
        tdJenisPekerjaan,
        tdGajiPerhari,
        masuk,
        hapus,
        edit)
    
    return tr
}

menampilkanGajian = (dataPegawai) => {
    const tr = document.createElement('tr')

    const tdNomor = document.createElement('td')
    tdNomor.innerText=dataPegawai.no

    const tdNama = document.createElement('td')
    tdNama.innerText = dataPegawai.nama

    const tdAbsen = document.createElement('td')
    tdAbsen.innerText = dataPegawai.absen

    const tdGajian = document.createElement('td')
    tdGajian.innerText = dataPegawai.gajian.toLocaleString()

    
    tr.append(
        tdNomor,
        tdNama,
        tdAbsen,
        tdGajian,)
    
    return tr
}

reset = () => {
    const nama = document.getElementById('nama')
    const pekerjaan = document.getElementById('pekerjaan')
    const lokasi = document.getElementById('lokasi')
    const gaji = document.getElementById('gaji')
    
    nama.value = ''
    pekerjaan.value = ''
    lokasi.value=''
    gaji.value=''
}

hitungGaji = (nomor) => {
    for (const gaji of dataPegawai) {
        if (gaji.no === nomor) { 
            gaji.absen++
        } if (gaji.absen == 8) {
            gaji.absen = 0
        }
        gaji.gajian = gaji.gajiPerhari * gaji.absen
    }
    saveLocalStorage()
    document.dispatchEvent(new Event(RENDER_DATA))
}

findIndex = (nomor) => {
    for (const pegawai of dataPegawai) {
        if (pegawai.no === nomor) {
            return pegawai
        }
    }
}

mengurutArray = () => {
    for (dataIndex in dataPegawai) {
        for (let i = 0; i <= dataIndex; i++){
            dataPegawai[i].no =  i+1
        }
    }
}

hapusDataPegawai = (nomor) => {
    const pegawai = findIndex(nomor)
    if (pegawai === -1) return
    
    let index = pegawai.no - 1

    dataPegawai.splice(index, 1)
    
    mengurutArray()
    
    document.dispatchEvent(new Event(RENDER_DATA))
    saveLocalStorage()
}

editData = (nomor) => {
    const data = findIndex(nomor)
    const input = document.querySelectorAll('input')

    input[0].value = data.nama
    input[1].value = data.jenisPekerjaan
    input[2].value = data.lokasi
    input[3].value = data.gajiPerhari
    const submit = document.querySelector('#input button')
    submit.addEventListener('click', () => {
        console.log('oke')
    })

    dataPegawai.splice(nomor - 1, 1)
    mengurutArray()
    
}

document.addEventListener("DOMContentLoaded", () => {
    const kirimDataPegawai = document.getElementById('input')
    kirimDataPegawai.addEventListener('submit', (event) => {
        event.preventDefault()
        tambahData()
        reset()
    })
    if (localStorage !== undefined) {
        loadData()
    }
})

document.addEventListener(RENDER_DATA, () => {
    const table = document.querySelectorAll('tbody')
    table[0].innerHTML = ''
    table[1].innerHTML = ''
    for (const data of dataPegawai) {
        table[0].append(menampilkanDataPegawai(data))
        table[1].append(menampilkanGajian(data))
    }
})
