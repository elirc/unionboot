using static DotnetWeb.W354;
namespace DotnetWeb;
public static class TestsW354{public static async Task Run(){await Task.CompletedTask;
{
using var services=Check.LinkServices("invoices","/invoices/{id:int}");var gen=services.GetRequiredService<LinkGenerator>();Check.Equal("/v4/invoices/7",Resolve(gen,7));Check.Equal("/v4/invoices/23",Resolve(gen,23));
}
{
using var services=Check.LinkServices("other","/other/{id}");Check.True(Resolve(services.GetRequiredService<LinkGenerator>(),7) is null);
}
}}
