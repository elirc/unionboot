using static DotnetWeb.W533;
namespace DotnetWeb;
public static class TestsW533{public static async Task Run(){await Task.CompletedTask;
{
var c=Check.Context("?culture=fr-FR");var provider=new QueryStringRequestCultureProvider();Check.Equal("fr-FR",await Resolve(c,provider));Check.Equal("de-DE",await Resolve(Check.Context(),provider));
}
{
var c=Check.Context();var calls=0;var provider=new CustomRequestCultureProvider(context=>{Check.True(ReferenceEquals(c,context));calls++;return Task.FromResult<ProviderCultureResult?>(new ProviderCultureResult("de-DE"));});Check.Equal("de-DE",await Resolve(c,provider));Check.Equal(1,calls);
}
}}
