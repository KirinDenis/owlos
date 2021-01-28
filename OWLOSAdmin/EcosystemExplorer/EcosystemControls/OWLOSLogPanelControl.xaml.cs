using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace OWLOSAdmin.EcosystemExplorer.EcosystemControls
{
    /// <summary>
    /// Interaction logic for OWLOSLogPanelControl.xaml
    /// </summary>
    public partial class OWLOSLogPanelControl : UserControl
    {

        private int logCount = 0;
        private double saveY = 0;
        private bool atAnimation = false;

        public OWLOSLogPanelControl()
        {
            InitializeComponent();
        }

        public void AddToLog(string text, int code)
        {
            List<string> lines = text.Split('\n').ToList();
            foreach (string line in lines)
            {
                Add(line, code);
            }
        }

        private void Add(string text, int code)
        {
            base.Dispatcher.Invoke(() =>
            {

                if (!string.IsNullOrEmpty(text))
                {
                    TextBlock textBlock = new TextBlock();
                    //textBlock.Text += DateTime.Now + " " + text;
                    logPanel.Children.Add(textBlock);
                    logCount++;
                    textBlock.Name = "text" + logCount.ToString();
                    
                    //textBlock.Foreground = new SolidColorBrush(Colors.LightBlue);
                    

                    if (!atAnimation)
                    {
                        atAnimation = true;
                        double EndY;
                        TextBlock prev = logPanel.Children[0] as TextBlock;
                        if (prev.ActualHeight != double.NaN)
                        {
                            if (prev.ActualHeight < 20)
                            {

                                EndY = -(logCount * prev.ActualHeight / 1.0f - logScrollView.ActualHeight);
                            }
                            else
                            {
                                EndY = -(logCount * prev.ActualHeight / 4.0f - logScrollView.ActualHeight);
                            }
                            //EndY = -(logCount * (prev.ActualHeight - prev.BaselineOffset));

                            //EndY = -(logCount * prev.ActualHeight / 3.0f);
                            //EndY = -logCount * 15;
                        }
                        else
                        {
                            EndY = -logCount * 15;
                        }




                        var AnimationY = new DoubleAnimation(saveY, EndY, TimeSpan.FromSeconds(1));
                        AnimationY.Completed += AnimationY_Completed;
                        saveY = EndY;

                        var Transform = new TranslateTransform();
                        logPanel.RenderTransform = Transform;


                        Transform.BeginAnimation(TranslateTransform.YProperty, AnimationY);

                    }


                    ColorAnimation animation = new ColorAnimation
                    {
                        To = ((SolidColorBrush)App.Current.Resources["OWLOSInfoAlpha4"]).Color,
                        Duration = new Duration(TimeSpan.FromSeconds(10))
                    };

                    switch (code)
                    {
                        case 0:
                            textBlock.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSSuccess"]).Color);
                            break;
                        case 1:
                            textBlock.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSWarning"]).Color);
                            break;
                        case 2:
                            textBlock.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSPrimary"]).Color);
                            break;
                        case 3:
                            textBlock.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSDanger"]).Color);
                            break;
                    }

                    textBlock.Foreground.BeginAnimation(SolidColorBrush.ColorProperty, animation);


                    //var AnimationS = new DoubleAnimation(0, 10, TimeSpan.FromSeconds(4));
                    //var Transform2 = new TranslateTransform();
                    //textBlock.RenderTransform = Transform2;
                    //Transform2.BeginAnimation(TranslateTransform.XProperty, AnimationS);


                    //https://stackoverflow.com/questions/3430659/is-there-a-wpf-typewriter-effect
                    Storyboard story = new Storyboard();
                    story.FillBehavior = FillBehavior.HoldEnd;
                    //story.RepeatBehavior = RepeatBehavior.

                    
                    StringAnimationUsingKeyFrames stringAnimationUsingKeyFrames = new StringAnimationUsingKeyFrames();
                    stringAnimationUsingKeyFrames.Duration = new Duration(TimeSpan.FromSeconds(1));


                    string tmp = string.Empty;
                    text = DateTime.Now + " " + text;
                    foreach (char c in text)
                    {
                        DiscreteStringKeyFrame discreteStringKeyFrame = new DiscreteStringKeyFrame();
                        discreteStringKeyFrame.KeyTime = KeyTime.Paced;
                        tmp += c;
                        stringAnimationUsingKeyFrames.KeyFrames.Add(discreteStringKeyFrame);
                        discreteStringKeyFrame.Value = tmp + "█";
                        
                    }
                    //textBlock.Inlines.ElementAt(0).Foreground = new SolidColorBrush(Colors.White);
                    //   Storyboard.SetTargetName(stringAnimationUsingKeyFrames, text.Name);
                    Storyboard.SetTargetProperty(stringAnimationUsingKeyFrames, new PropertyPath(TextBlock.TextProperty));
                    story.Children.Add(stringAnimationUsingKeyFrames);

                    story.Begin(textBlock);

                    


                    /*
                    ColorAnimation animation2;
                    animation2 = new ColorAnimation
                    {
                        To = Colors.Black,
                        Duration = new Duration(TimeSpan.FromSeconds(3))
                    };

                    text.Background = new SolidColorBrush(Colors.LightBlue);
                    text.Background.BeginAnimation(SolidColorBrush.ColorProperty, animation2);
                    */


                    //var StartY = Canvas.GetTop(logPanel);
                    //if (StartY == double.NaN)
                    //{
                    //  StartY = 0;
                    //}




                }
            });

        }


        private void AnimationY_Completed(object sender, EventArgs e)
        {
            atAnimation = false;
        }


    }
}
