using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using NotDefteri.Models;
using System.Diagnostics;

namespace NotDefteri.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IWebHostEnvironment hostEnvironment;

        public HomeController(ILogger<HomeController> logger, IWebHostEnvironment hostEnvironment)
        {
            _logger = logger;
            this.hostEnvironment = hostEnvironment;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Kaydet(Sayfa[] sayfalar)
        {
            var json = JsonConvert.SerializeObject(sayfalar);
            var kaydetYol = hostEnvironment.WebRootPath + "\\App_Data\\veri.json";
            System.IO.File.WriteAllText(kaydetYol, json);
            return Json(new { success = true });
        }

        [HttpPost]
        public IActionResult SayfalarJson()
        {
            try
            {
                var okuYol = hostEnvironment.WebRootPath + "\\App_Data\\veri.json";
                var json = System.IO.File.ReadAllText(okuYol);
                var sayfalar = JsonConvert.DeserializeObject<Sayfa[]>(json);
                return Json(sayfalar);
            }
            catch (System.Exception)
            {
                return Json(new Sayfa[0]);
            }
   
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
