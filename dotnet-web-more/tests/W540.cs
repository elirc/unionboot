using static DotnetWeb.W540;
namespace DotnetWeb;
public static class TestsW540{public static async Task Run(){await Task.CompletedTask;
{
var c=Check.Context("?culture=fr-FR");var provider=new QueryStringRequestCultureProvider();Check.Equal("fr-FR",await Resolve(c,provider));Check.Equal("sv-SE",await Resolve(Check.Context(),provider));
}
{
var c=Check.Context();var calls=0;var provider=new CustomRequestCultureProvider(context=>{Check.True(ReferenceEquals(c,context));calls++;return Task.FromResult<ProviderCultureResult?>(new ProviderCultureResult("de-DE"));});Check.Equal("de-DE",await Resolve(c,provider));Check.Equal(1,calls);
}
}}
