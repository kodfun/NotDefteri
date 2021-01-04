var sayfaNo = -1;

function sayfaAdet() {
    return $("#myTab .nav-link:not(#sekme-ekle)").length;
}

function htmlEncode(html) {
    return $("<div/>").text(html).html();
}

function sayfaAc(sayfaNo) {
    // https://getbootstrap.com/docs/5.0/components/navs-tabs/#show
    var tabTriggerEl = $('#sekme-' + sayfaNo)[0];
    var tab = new bootstrap.Tab(tabTriggerEl);
    tab.show();
}

function ilkSayfaAc() {
    // https://getbootstrap.com/docs/5.0/components/navs-tabs/#show
    var tabTriggerEl = $('#myTab .nav-link:not(#sekme-ekle)')[0];
    if (tabTriggerEl) {
        var tab = new bootstrap.Tab(tabTriggerEl);
        tab.show();
    }
}

function sayfaAcIndeksIle(indeks) {
    var sayAdet = sayfaAdet();
    indeks = indeks < sayAdet ? indeks : sayAdet - 1;
    if (sayfaAdet < 0) return;
    var tabTriggerEl = $("#myTab .nav-link:not(#sekme-ekle)").eq(indeks)[0];
    if (tabTriggerEl) {
        var tab = new bootstrap.Tab(tabTriggerEl);
        tab.show();
    }
}

function yeniSekme(baslik, icerik, goster = true) {
    sayfaNo++;
    var sekme =
        '<li class="nav-item" role="presentation">' +
        '<a class="nav-link" id="sekme-' + sayfaNo + '" data-bs-toggle="tab" href="#sayfa-' + sayfaNo + '" role="tab" aria-controls="home" aria-selected="true">' +
        htmlEncode(baslik) +
        '<i class="fas fa-times sekme-kapat"></i>' +
        '</a>' +
        '</li>';

    var sayfa =
        '<div class="h-100 tab-pane fade" id="sayfa-' + sayfaNo + '" role="tabpanel" aria-labelledby="contact-tab">' +
        '<textarea data-baslik="' + baslik + '" class="h-100 border-0 form-control">' + htmlEncode(icerik || "") + '</textarea>' +
        '</div>';

    $(sekme).insertBefore("#sekme-ekle-li");
    $("#myTabContent").append(sayfa);
    if(goster)
        sayfaAc(sayfaNo);
}

$("#sekme-ekle").click(function (event) {
    event.preventDefault();

    var baslik = prompt("Sayfa adı:", "Yeni Sayfa");
    yeniSekme(baslik);
});

$("body").on("click", ".sekme-kapat", function (event) {
    event.preventDefault();

    var li = $(this).closest("li.nav-item");
    var indeks = li.index();
    var paneId = $(this).closest("a.nav-link").attr("href");
    li.remove();
    $(paneId).remove();
    sayfaAcIndeksIle(indeks);
});

$("#kaydet").click(function () {
    var sayfalar = [];
    $("#myTabContent > .tab-pane > textarea").each(function (index, textarea) {
        var baslik = $(textarea).data("baslik");
        var icerik = $(textarea).val();
        sayfalar.push({ baslik: baslik, icerik: icerik });
    });

    $.ajax({
        type: "post",
        url: "/Home/Kaydet",
        data: { sayfalar: sayfalar },
        success: function (data) {
            if (data.success) {
                alert("Başarıyla kaydedildi.");
            }
        }
    });
});

$.ajax({
    type: "post",
    url: "/Home/SayfalarJson",
    success: function (sayfalar) {

        $.each(sayfalar, function (index, sayfa) {
            yeniSekme(sayfa.baslik, sayfa.icerik, false);
        });

        ilkSayfaAc();
    }
});