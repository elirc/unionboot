using static DotnetWeb.W456;
namespace DotnetWeb;
public static class TestsW456{public static async Task Run(){await Task.CompletedTask;
{
using var sp=Configure(3);Check.Equal(21,sp.GetRequiredService<IOptions<Settings>>().Value.Limit);using var defaults=Configure(0);Check.Equal(7,defaults.GetRequiredService<IOptions<Settings>>().Value.Limit);
}
{
using var low=Configure(-1);Check.Throws<OptionsValidationException>(()=>{var value=low.GetRequiredService<IOptions<Settings>>().Value;});using var high=Configure(11);Check.Throws<OptionsValidationException>(()=>{var value=high.GetRequiredService<IOptions<Settings>>().Value;});using var edge=Configure(10);Check.Equal(70,edge.GetRequiredService<IOptions<Settings>>().Value.Limit);
}
}}
