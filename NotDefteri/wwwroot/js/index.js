var sayfaNo = -1;

function htmlEncode(html) {
    return $("<div/>").text(html).html();
}

function sayfaAc(sayfaNo) {
    // https://getbootstrap.com/docs/5.0/components/navs-tabs/#show
    var tabTriggerEl = document.querySelector('#sekme-' + sayfaNo);
    var tab = new bootstrap.Tab(tabTriggerEl);
    tab.show();
}

function ilkSayfaAc() {
    // https://getbootstrap.com/docs/5.0/components/navs-tabs/#show
    var tabTriggerEl = document.querySelector('#myTab .nav-link:not(#sekme-ekle)');
    console.log(tabTriggerEl);
    if (tabTriggerEl) {
        var tab = new bootstrap.Tab(tabTriggerEl);
        tab.show();
    }
}

function yeniSekme(sekmeAd, icerik) {
    sayfaNo++;
    var sekme =
        '<li class="nav-item" role="presentation">' +
        '<a class="nav-link" id="sekme-' + sayfaNo + '" data-bs-toggle="tab" href="#sayfa-' + sayfaNo + '" role="tab" aria-controls="home" aria-selected="true">' +
        htmlEncode(sekmeAd) +
        '<i class="fas fa-times sekme-kapat"></i>' +
        '</a>' +
        '</li>';

    var sayfa =
        '<div class="h-100 tab-pane fade" id="sayfa-' + sayfaNo + '" role="tabpanel" aria-labelledby="contact-tab">' +
        '<textarea data-baslik="' + sekmeAd + '" class="h-100 border-0 form-control">' + htmlEncode(icerik || "") + '</textarea>' +
        '</div>';

    $(sekme).insertBefore("#sekme-ekle-li");
    $("#myTabContent").append(sayfa);
    sayfaAc(sayfaNo);
}

$("#sekme-ekle").click(function (event) {
    event.preventDefault();

    var sekmeAd = prompt("Sayfa adı:", "Yeni Sayfa");
    yeniSekme(sekmeAd);
});

$("body").on("click", ".sekme-kapat", function (event) {
    event.preventDefault();

    var li = $(this).closest("li.nav-item");
    var paneId = $(this).closest("a.nav-link").attr("href");
    li.remove();
    $(paneId).remove();

    ilkSayfaAc();
});

$("#kaydet").click(function () {
    var sayfalar = [];
    $("#myTabContent > .tab-pane > textarea").each(function (index, textarea) {
        var baslik = $(textarea).data("baslik");
        var icerik = $(textarea).val();
        sayfalar.push({ baslik: baslik, icerik: icerik });
    });

    console.log(sayfalar);
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
        console.log(sayfalar);

        $.each(sayfalar, function (index, sayfa) {
            yeniSekme(sayfa.baslik, sayfa.icerik);
        });
    }
});